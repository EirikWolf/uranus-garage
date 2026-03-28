# Fase 2C: Innhold + Bryggelaben Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add article content pages (Akademiet, Råvarefokus, DIY-hjørnet) with Sanity CMS, and a Bryggelaben with RAPT hydrometer integration and chart visualization.

**Architecture:** New Sanity `article` and `brewLabEntry` schemas. Articles served via GROQ with category filtering. Bryggelaben uses a Next.js API route as proxy to RAPT Cloud API, stores data in Sanity, and renders charts with Recharts.

**Tech Stack:** TypeScript, Sanity v3, Recharts, Next.js API routes, RAPT Cloud API

**Spec:** `docs/superpowers/specs/2026-03-28-fase2-design.md`

---

## Task 1: Sanity article + brewLabEntry schemas + queries

## Task 2: Article list + detail pages

## Task 3: Bryggelaben schema + RAPT API route

## Task 4: Bryggelaben UI with Recharts

## Task 5: Navigation update (Lær dropdown + Bryggelaben link)

(Full task details provided to subagents directly)
