'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { MessageCircle, Volume2, VolumeX } from 'lucide-react'
import { SITE, VOICE_TOUR_DONE_KEY, VOICE_TOUR_SCRIPT, WHATSAPP_HREF } from '@/lib/site'

/**
 * Two fixed 56px circular buttons, 24px from the edges, z-index 9998, both
 * lifted by the iOS safe area helper: WhatsApp on the right, voice tour on the
 * left. The tour speaks once per visitor (auto), can be muted mid flight, and
 * turns into a replay control when it finishes.
 */
export function FloatButtons() {
  return (
    <>
      <WhatsAppButton />
      <VoiceTourButton />
    </>
  )
}

function WhatsAppButton() {
  return (
    <a
      href={WHATSAPP_HREF}
      target="_blank"
      rel="noopener noreferrer"
      className="float-button float-button--whatsapp bottom-safe group"
      aria-label="Chat with us on WhatsApp"
      data-tooltip="Chat with us on WhatsApp"
    >
      <MessageCircle className="h-6 w-6" aria-hidden="true" />
      <span
        aria-hidden="true"
        className="pointer-events-none absolute right-full mr-3 hidden whitespace-nowrap rounded-[3px] bg-[color:var(--nb-secondary)] px-3 py-2 text-[12px] font-semibold uppercase tracking-[0.08em] text-white opacity-0 shadow-[var(--nb-shadow-card)] transition-opacity duration-200 group-hover:opacity-100 sm:block"
      >
        Chat with us on WhatsApp
      </span>
    </a>
  )
}

function VoiceTourButton() {
  const [supported, setSupported] = useState(true)
  const [speaking, setSpeaking] = useState(false)
  const [played, setPlayed] = useState(false)
  const [finished, setFinished] = useState(false)
  const startedRef = useRef(false)
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null)

  useEffect(() => {
    setSupported(typeof window !== 'undefined' && 'speechSynthesis' in window)
    try {
      setPlayed(window.localStorage.getItem(VOICE_TOUR_DONE_KEY) === '1')
    } catch {
      /* private mode: the tour can still run, it just will not remember */
    }
  }, [])

  const speak = useCallback(() => {
    if (!supported) return
    const synth = window.speechSynthesis
    synth.cancel()

    const utterance = new SpeechSynthesisUtterance(VOICE_TOUR_SCRIPT)
    utterance.rate = 0.95
    utterance.pitch = 1.1
    utterance.lang = 'en-KE'

    const voices = synth.getVoices()
    const preferred =
      voices.find((voice) => voice.lang?.toLowerCase().startsWith('en-ke')) ??
      voices.find((voice) => voice.lang?.toLowerCase().startsWith('en-ng')) ??
      voices.find((voice) => voice.lang?.toLowerCase().startsWith('en-gb'))
    if (preferred) utterance.voice = preferred

    utterance.onstart = () => setSpeaking(true)
    utterance.onend = () => {
      setSpeaking(false)
      setFinished(true)
      startedRef.current = true
      try {
        window.localStorage.setItem(VOICE_TOUR_DONE_KEY, '1')
      } catch {
        /* ignore */
      }
    }
    utterance.onerror = () => {
      setSpeaking(false)
      setFinished(true)
    }

    utteranceRef.current = utterance
    synth.speak(utterance)
  }, [supported])

  /** Trigger on first scroll or first click, and only once. */
  useEffect(() => {
    if (!supported || played) return
    let armed = false

    const trigger = () => {
      if (armed || startedRef.current) return
      armed = true
      cleanup()
      speak()
    }

    const cleanup = () => {
      window.removeEventListener('scroll', trigger)
      window.removeEventListener('pointerdown', trigger)
    }

    window.addEventListener('scroll', trigger, { passive: true, once: true })
    window.addEventListener('pointerdown', trigger, { once: true })

    return () => {
      cleanup()
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) window.speechSynthesis.cancel()
    }
  }, [supported, played, speak])

  if (!supported) return null

  const handleClick = () => {
    if (speaking) {
      window.speechSynthesis.cancel()
      setSpeaking(false)
      setFinished(true)
      return
    }
    setFinished(false)
    speak()
  }

  const label = speaking
    ? 'Site voice tour, click to mute'
    : finished
      ? 'Replay tour'
      : 'Hear what this site is about'

  return (
    <button
      type="button"
      onClick={handleClick}
      className={`float-button float-button--voice bottom-safe group bg-[color:var(--nb-secondary)]${
        speaking ? ' is-speaking' : ''
      }`}
      aria-label={label}
      data-tooltip={label}
      aria-live="polite"
    >
      {speaking ? (
        <Volume2 className="h-6 w-6" aria-hidden="true" />
      ) : (
        <VolumeX className="h-6 w-6" aria-hidden="true" />
      )}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute left-full ml-3 hidden whitespace-nowrap rounded-[3px] bg-[color:var(--nb-secondary)] px-3 py-2 text-[12px] font-semibold uppercase tracking-[0.08em] text-white opacity-0 shadow-[var(--nb-shadow-card)] transition-opacity duration-200 group-hover:opacity-100 sm:block"
      >
        {speaking ? 'Mute tour' : finished ? 'Replay tour' : 'Hear what this site is about'}
      </span>
      <span className="sr-only">{SITE.name} voice tour</span>
    </button>
  )
}

export default FloatButtons
