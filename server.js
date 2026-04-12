const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');
const path = require('path');

const app = express();
const PORT = 3000;

// ─── CREDENTIALS (server-side only, never exposed to client) ─────────────────
const ANAM_API_KEY = 'MmQyNzJjZDAtOWJiOC00NmE1LTkxMTgtODg1MzhjM2Q0MDU5OjJYbW1ZOEN1S0pmWkx2MjcvWENMREdBYkcrV1U2NldISzZ5SDNGcDZ1ODg9';
const PERSONA_ID = '82103afc-ea75-4767-b0de-2fc3ea8d5630';
// ─────────────────────────────────────────────────────────────────────────────

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// ─── SESSION TOKEN ENDPOINT ───────────────────────────────────────────────────
app.post('/api/session-token', async (req, res) => {
  try {
    console.log('[Anam] Requesting session token for persona:', PERSONA_ID);

    const response = await fetch('https://api.anam.ai/v1/auth/session-token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${ANAM_API_KEY}`,
      },
      body: JSON.stringify({
        personaConfig: {
          personaId: PERSONA_ID,
        },
      }),
    });

    const text = await response.text();
    console.log(`[Anam] Response ${response.status}:`, text.substring(0, 200));

    if (!response.ok) {
      console.error('[Anam] Session token error:', response.status, text);
      return res.status(response.status).json({
        error: 'Failed to create session token',
        details: text,
      });
    }

    const data = JSON.parse(text);
    console.log('[Anam] ✅ Session token created successfully!');
    res.json({ sessionToken: data.sessionToken });

  } catch (err) {
    console.error('[Anam] Server error:', err.message);
    res.status(500).json({ error: 'Internal server error', details: err.message });
  }
});

// ─── FALLBACK ─────────────────────────────────────────────────────────────────
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// ─── START ────────────────────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log('\n╔══════════════════════════════════════════════════════╗');
  console.log('║   🧠  Mental Health Counsellor — Anam AI Avatar       ║');
  console.log('╠══════════════════════════════════════════════════════╣');
  console.log(`║   Server running at: http://localhost:${PORT}           ║`);
  console.log('╚══════════════════════════════════════════════════════╝\n');
});
