// Scrapes RAPT data from the custom PHP endpoints at problembar.net

const SHOW_API_URL = "https://problembar.net/uranus/RAPT/api/ShowAPI.php";
const SHOW_PILLIN_URL = "https://problembar.net/uranus/RAPT/Pillin/ShowPillin.php";

export interface RawSession {
  name: string;
  createdOn: string;
  endingOn: string | null;
  og: number | null;
  fg: number | null;
  abv: number | null;
  numDays: number | null;
  numPosts: number | null;
}

export interface RawReading {
  deviceName: string;
  deviceId: string | null;
  profileId: string | null;
  profileName: string | null;
  temperature: number | null;
  gravity: number | null;
  pressure: number | null;
  battery: number | null;
  rssi: number | null;
  timestamp: string | null;
  isActive: boolean;
}

function parseFloat_(s: string | undefined): number | null {
  if (!s) return null;
  const n = parseFloat(s.replace(",", ".").trim());
  return isNaN(n) ? null : n;
}

function parseInt_(s: string | undefined): number | null {
  if (!s) return null;
  const n = parseInt(s.trim(), 10);
  return isNaN(n) ? null : n;
}

// Extracts all table rows from an HTML string and maps column positions to values.
function parseHtmlTable(html: string): string[][] {
  const rows: string[][] = [];
  const rowRegex = /<tr[^>]*>([\s\S]*?)<\/tr>/gi;
  const cellRegex = /<t[dh][^>]*>([\s\S]*?)<\/t[dh]>/gi;

  let rowMatch: RegExpExecArray | null;
  while ((rowMatch = rowRegex.exec(html)) !== null) {
    const cells: string[] = [];
    let cellMatch: RegExpExecArray | null;
    while ((cellMatch = cellRegex.exec(rowMatch[1])) !== null) {
      // Strip HTML tags and decode entities
      cells.push(
        cellMatch[1]
          .replace(/<[^>]+>/g, "")
          .replace(/&amp;/g, "&")
          .replace(/&lt;/g, "<")
          .replace(/&gt;/g, ">")
          .replace(/&nbsp;/g, " ")
          .trim(),
      );
    }
    if (cells.length > 0) rows.push(cells);
  }
  return rows;
}

// Extracts a value from text like "Label: value" or "Label value"
function extractField(text: string, label: string): string | null {
  const regex = new RegExp(label + "[:\\s]+([^\\n<]+)", "i");
  const m = regex.exec(text);
  return m ? m[1].trim() : null;
}

export async function scrapeBrewSessions(): Promise<RawSession[]> {
  const res = await fetch(SHOW_API_URL, { cache: "no-store" });
  if (!res.ok) throw new Error(`ShowAPI.php returned ${res.status}`);
  const html = await res.text();

  const rows = parseHtmlTable(html);
  const sessions: RawSession[] = [];

  for (const row of rows) {
    // Skip header rows (first cell looks like a column name)
    if (!row[0] || /^(name|session|brygg)/i.test(row[0])) continue;
    // Expect at least: name, createdOn, endingOn, lastActivity, OG, FG, ABV, numDays, numPosts
    if (row.length < 5) continue;

    sessions.push({
      name: row[0],
      createdOn: row[1] || new Date().toISOString().slice(0, 10),
      endingOn: row[2] || null,
      og: parseFloat_(row[4]),
      fg: parseFloat_(row[5]),
      abv: parseFloat_(row[6]),
      numDays: parseInt_(row[7]),
      numPosts: parseInt_(row[8]),
    });
  }

  return sessions;
}

export async function scrapeCurrentReadings(): Promise<RawReading[]> {
  const res = await fetch(SHOW_PILLIN_URL, { cache: "no-store" });
  if (!res.ok) throw new Error(`ShowPillin.php returned ${res.status}`);
  const html = await res.text();

  const readings: RawReading[] = [];

  // Each device is a section — split on device UUID pattern or heading pattern
  // The page renders blocks per device. We look for UUID patterns and label/value pairs.
  const uuidRegex =
    /([0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12})/gi;
  const uuids: string[] = [];
  let m: RegExpExecArray | null;
  while ((m = uuidRegex.exec(html)) !== null) {
    uuids.push(m[1]);
  }

  // Split HTML into per-device sections by looking for heading elements or <h2>/<h3> tags
  const sectionRegex = /<(?:h[123]|div[^>]*header)[^>]*>([\s\S]*?)<\/(?:h[123]|div)>([\s\S]*?)(?=<(?:h[123]|div[^>]*header)|$)/gi;
  const sections: Array<{ heading: string; body: string }> = [];
  while ((m = sectionRegex.exec(html)) !== null) {
    sections.push({
      heading: m[1].replace(/<[^>]+>/g, "").trim(),
      body: m[2],
    });
  }

  // Fallback: if no sections found, try splitting on <br> separated blocks
  // and look for device name + temperature patterns
  if (sections.length === 0) {
    // Parse the flat structure using label patterns
    const devicePattern =
      /(?:Device|Enhet|Name|Navn)[:\s]+([^\n<]+)/gi;
    const tempPattern = /Temperature[:\s]+([\d.,]+)/gi;
    const gravPattern = /(?:Gravity|Oeksler)[:\s]+([\d.,]+)/gi;
    const battPattern = /Battery[:\s]+([\d.,]+)/gi;
    const rssiPattern = /RSSI[:\s]+([-\d]+)/gi;
    const tsPattern = /(?:Timestamp|Last[^:]*)[:\s]+(\d{4}-\d{2}-\d{2}[T\s]\d{2}:\d{2}(?::\d{2})?)/gi;
    const profilePattern = /(?:Profile|Profil)[:\s]+([^\n<(]+)/gi;
    const idPattern = /ID[:\s]+([0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12})/gi;

    // Collect all matches with positions to group them
    type FieldMatch = { type: string; value: string; pos: number };
    const fields: FieldMatch[] = [];
    for (const [type, rx] of [
      ["device", devicePattern],
      ["temp", tempPattern],
      ["grav", gravPattern],
      ["batt", battPattern],
      ["rssi", rssiPattern],
      ["ts", tsPattern],
      ["profile", profilePattern],
      ["id", idPattern],
    ] as Array<[string, RegExp]>) {
      let match: RegExpExecArray | null;
      while ((match = rx.exec(html)) !== null) {
        fields.push({ type, value: match[1].trim(), pos: match.index });
      }
    }
    fields.sort((a, b) => a.pos - b.pos);

    // Group fields into device blocks by proximity
    let current: Partial<RawReading> | null = null;
    for (const f of fields) {
      if (f.type === "device" || (f.type === "id" && !current)) {
        if (current?.deviceName) readings.push(current as RawReading);
        current = { isActive: false, deviceId: null, profileId: null, profileName: null };
      }
      if (!current) current = { isActive: false, deviceId: null, profileId: null, profileName: null };
      switch (f.type) {
        case "device": current.deviceName = f.value; break;
        case "temp": current.temperature = parseFloat_(f.value); break;
        case "grav": current.gravity = parseFloat_(f.value); break;
        case "batt": current.battery = parseFloat_(f.value); break;
        case "rssi": current.rssi = parseInt_(f.value); break;
        case "ts": current.timestamp = f.value; break;
        case "profile": current.profileName = f.value; current.isActive = true; break;
        case "id":
          if (!current.deviceId) current.deviceId = f.value;
          else current.profileId = f.value;
          break;
      }
    }
    if (current?.deviceName) readings.push(current as RawReading);
  } else {
    // Parse structured sections
    for (const section of sections) {
      const reading: RawReading = {
        deviceName: section.heading,
        deviceId: extractField(section.body, "ID") || null,
        profileId: extractField(section.body, "Profile ID") || null,
        profileName: extractField(section.body, "Profile") || null,
        temperature: parseFloat_(extractField(section.body, "Temperature") || undefined),
        gravity: parseFloat_(extractField(section.body, "(?:Gravity|Oeksler)") || undefined),
        pressure: parseFloat_(extractField(section.body, "Pressure") || undefined),
        battery: parseFloat_(extractField(section.body, "Battery") || undefined),
        rssi: parseInt_(extractField(section.body, "RSSI") || undefined),
        timestamp: extractField(section.body, "(?:Timestamp|Last activity)"),
        isActive: /active|aktiv/i.test(section.body) && !/inactive|inaktiv/i.test(section.body),
      };
      if (reading.deviceName) readings.push(reading);
    }
  }

  return readings;
}
