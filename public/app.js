/**
 * Heaven AI — AI Mental Health Counsellor
 * Clean minimal frontend — Anam AI JS SDK
 */

import { createClient } from 'https://esm.sh/@anam-ai/js-sdk@latest';

// ── Landing page ──────────────────────────────────────────────────────────────
(function initLanding() {
    const overlay = document.getElementById('landing-overlay');
    const enterBtn = document.getElementById('enter-btn');
    const header = document.getElementById('app-header');
    const main_el = document.getElementById('app-main');
    const orbField = document.getElementById('orb-field');

    // Spawn floating orbs in the background
    const ORB_COUNT = 18;
    for (let i = 0; i < ORB_COUNT; i++) {
        const orb = document.createElement('div');
        orb.className = 'orb';
        const size = Math.random() * 22 + 6;         // 6–28 px
        const left = Math.random() * 100;            // 0–100%
        const delay = Math.random() * 12;            // 0–12 s offset
        const duration = Math.random() * 14 + 10;   // 10–24 s rise time
        orb.style.cssText = `
      width: ${size}px;
      height: ${size}px;
      left: ${left}%;
      bottom: -${size}px;
      animation-duration: ${duration}s;
      animation-delay: ${delay}s;
    `;
        orbField.appendChild(orb);
    }

    // Dismiss handler
    enterBtn.addEventListener('click', () => {
        // 1. Fade out overlay
        overlay.classList.add('dismissed');

        // 2. After transition, hide it completely then reveal app
        overlay.addEventListener('transitionend', () => {
            overlay.style.display = 'none';
            header.classList.add('revealed');
            main_el.classList.add('revealed');
        }, { once: true });
    });
})();

// ── DOM ──────────────────────────────────────────────────────────────────────
const videoEl = document.getElementById('persona-video');
const idleScreen = document.getElementById('idle-screen');
const agentTalking = document.getElementById('agent-talking');
const topbarDot = document.querySelector('.topbar-dot');
const topbarStatus = document.getElementById('topbar-status');

const startBtn = document.getElementById('start-btn');
const stopBtn = document.getElementById('stop-btn');
const muteBtn = document.getElementById('mute-btn');
const sessionControls = document.getElementById('session-controls');
const clearBtn = document.getElementById('clear-transcript-btn');

const transcriptBody = document.getElementById('transcript-body');

// ── State ────────────────────────────────────────────────────────────────────
let anamClient = null;
let isMuted = false;

// ── Status helpers ────────────────────────────────────────────────────────────
function setStatus(dotClass, label) {
    topbarDot.className = `topbar-dot ${dotClass}`;
    topbarStatus.textContent = label.toUpperCase();
}

// ── Transcript ────────────────────────────────────────────────────────────────
const liveMessages = {};   // id → <p class="msg-text">

function addMessage(role, id) {
    // clear empty hint
    const hint = transcriptBody.querySelector('.empty-hint');
    if (hint) hint.remove();

    const row = document.createElement('div');
    row.className = `transcript-msg ${role}`;
    row.id = `msg-${id}`;

    const label = document.createElement('span');
    label.className = 'msg-role';
    label.textContent = role === 'agent' ? 'Agent:' : 'You:';

    const text = document.createElement('span');
    text.className = 'msg-text msg-streaming';

    row.appendChild(label);
    row.appendChild(text);
    transcriptBody.appendChild(row);
    transcriptBody.scrollTop = transcriptBody.scrollHeight;
    return text;
}

function appendToMessage(id, chunk) {
    liveMessages[id].textContent += chunk;
    transcriptBody.scrollTop = transcriptBody.scrollHeight;
}

function finaliseMessage(id) {
    if (liveMessages[id]) {
        liveMessages[id].classList.remove('msg-streaming');
        delete liveMessages[id];
    }
}

// ── Session token ─────────────────────────────────────────────────────────────
async function fetchSessionToken() {
    const res = await fetch('/api/session-token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
    });
    if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.details || `HTTP ${res.status}`);
    }
    return (await res.json()).sessionToken;
}

// ── Start ─────────────────────────────────────────────────────────────────────
async function startSession() {
    startBtn.disabled = true;
    setStatus('loading', 'Connecting…');

    try {
        const sessionToken = await fetchSessionToken();
        anamClient = createClient(sessionToken);

        // Connection
        anamClient.addListener('CONNECTION_ESTABLISHED', () => {
            setStatus('live', 'Live');
            idleScreen.classList.add('hidden');
            videoEl.classList.remove('hidden');
            startBtn.classList.add('hidden');
            sessionControls.classList.remove('hidden');
        });

        anamClient.addListener('CONNECTION_CLOSED', () => {
            endSession();
        });

        // Speaking indicators
        anamClient.addListener('AGENT_START_TALKING', () => {
            agentTalking.classList.remove('hidden');
        });

        anamClient.addListener('AGENT_STOP_TALKING', () => {
            agentTalking.classList.add('hidden');
        });

        // ── Transcript (real-time streaming) ──────────────────────────────────────
        anamClient.addListener('MESSAGE_STREAM_EVENT_RECEIVED', (event) => {
            const role = event.role === 'persona' ? 'agent' : 'user';
            const content = event.content || '';
            if (!content) return;

            if (!liveMessages[event.id]) {
                liveMessages[event.id] = addMessage(role, event.id);
            }

            appendToMessage(event.id, content);

            if (event.endOfSpeech) {
                finaliseMessage(event.id);
            }
        });

        await anamClient.streamToVideoElement('persona-video');

    } catch (err) {
        console.error('[Anam] error:', err);
        setStatus('error', 'Error');

        // show error in transcript area
        const hint = transcriptBody.querySelector('.empty-hint');
        if (hint) hint.remove();
        const errEl = document.createElement('p');
        errEl.className = 'empty-hint';
        errEl.style.color = '#e5484d';
        errEl.textContent = `⚠ ${err.message}`;
        transcriptBody.appendChild(errEl);

        startBtn.disabled = false;
        startBtn.classList.remove('hidden');
        sessionControls.classList.add('hidden');
    }
}

// ── Stop ──────────────────────────────────────────────────────────────────────
async function stopSession() {
    try {
        if (anamClient) { await anamClient.stopStreaming(); anamClient = null; }
    } catch (e) { /* ignore */ }
    endSession();
}

function endSession() {
    isMuted = false;
    agentTalking.classList.add('hidden');
    videoEl.classList.add('hidden');
    idleScreen.classList.remove('hidden');
    sessionControls.classList.add('hidden');
    startBtn.classList.remove('hidden');
    startBtn.disabled = false;
    muteBtn.textContent = '🎙 Mute';
    muteBtn.classList.remove('muted');
    setStatus('', 'Offline');
}

// ── Mute ──────────────────────────────────────────────────────────────────────
async function toggleMute() {
    if (!anamClient) return;
    try {
        if (isMuted) {
            await anamClient.unmuteLocalAudio();
            isMuted = false;
            muteBtn.textContent = '🎙 Mute';
            muteBtn.classList.remove('muted');
        } else {
            await anamClient.muteLocalAudio();
            isMuted = true;
            muteBtn.textContent = '🔇 Unmute';
            muteBtn.classList.add('muted');
        }
    } catch (e) { console.warn('mute error', e); }
}

// ── Clear transcript ──────────────────────────────────────────────────────────
function clearTranscript() {
    transcriptBody.innerHTML = '<p class="empty-hint">Your conversation will appear here once the session begins.</p>';
}

// ── Listeners ─────────────────────────────────────────────────────────────────
startBtn.addEventListener('click', startSession);
stopBtn.addEventListener('click', stopSession);
muteBtn.addEventListener('click', toggleMute);
clearBtn.addEventListener('click', clearTranscript);
