# 🚀 COSMIC Data Fusion Platform

> **Unified Astronomical Data Processing Platform**
> A cloud-enabled data fusion engine capable of ingesting, standardizing, and harmonizing astronomical datasets from global observatories.

![Project Status](https://img.shields.io/badge/Status-Prototype-blue)
![License](https://img.shields.io/badge/License-MIT-green)

## 🌌 Overview

Astronomical data is currently fragmented across incompatible file formats, coordinate systems, and metadata structures. Researchers struggle to combine datasets from different missions (like Hubble, Kepler, or TESS) without extensive manual preprocessing.

**COSMIC** solves this by providing a unified interface that:
1.  **Aggregates** data from SIMBAD and NASA MAST APIs.
2.  **Harmonizes** coordinates and units into a standard format.
3.  **Visualizes** multi-mission data in a modern, dark-mode dashboard.

## ✨ Key Features

* **🔍 Multi-Source Ingestion:** Real-time fetching from SIMBAD (Identity) and NASA MAST (Mission Data).
* **📐 Coordinate Harmonization:** Automatic conversion of RA/DEC into unified ICRS frames.
* **🎨 Glassmorphic UI:** A professional, space-themed dashboard built with React & Tailwind CSS.
* **⚡ Fallback Architecture:** Resilient backend design with mock data generation during API outages.

## 🛠️ Tech Stack

### Frontend (Client)
* **Framework:** React (Vite) + TypeScript
* **Styling:** Tailwind CSS + Framer Motion (Animations)
* **Icons:** Lucide React
* **State Management:** React Hooks

### Backend (Server)
* **API Framework:** FastAPI (Python)
* **Server:** Uvicorn
* **Astronomy Libs:** `astropy`, `astroquery`, `numpy`

---
