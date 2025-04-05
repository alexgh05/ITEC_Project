import { useState, useEffect, useRef } from 'react';
import { useAudio } from '@/providers/ThemeProvider';

export const useAudioVisualizer = (numBars = 20, sensitivity = 1.5) => {
  const [audioData, setAudioData] = useState<number[]>(Array(numBars).fill(0));
  const { audioRef, isPlaying } = useAudio();
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const dataArrayRef = useRef<Uint8Array | null>(null);
  const sourceRef = useRef<MediaElementAudioSourceNode | null>(null);
  const animationFrameRef = useRef<number | null>(null);

  // Initialize audio analyzer
  useEffect(() => {
    if (!audioRef.current) return;

    // Create audio context
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }

    // Create analyzer
    if (!analyserRef.current) {
      analyserRef.current = audioContextRef.current.createAnalyser();
      analyserRef.current.fftSize = 256;
      analyserRef.current.smoothingTimeConstant = 0.8;
    }

    // Create data array for frequency data
    if (!dataArrayRef.current) {
      const bufferLength = analyserRef.current.frequencyBinCount;
      dataArrayRef.current = new Uint8Array(bufferLength);
    }

    // Connect audio element to analyzer
    if (!sourceRef.current && audioRef.current) {
      sourceRef.current = audioContextRef.current.createMediaElementSource(audioRef.current);
      sourceRef.current.connect(analyserRef.current);
      analyserRef.current.connect(audioContextRef.current.destination);
    }

    // Cleanup
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [audioRef]);

  // Animation loop
  useEffect(() => {
    if (!isPlaying || !analyserRef.current || !dataArrayRef.current) return;

    const analyze = () => {
      analyserRef.current!.getByteFrequencyData(dataArrayRef.current!);

      // Process data for visualization
      // We'll sample points from the frequency data to get our bars
      const data = [...dataArrayRef.current!];
      const sampleSize = Math.floor(data.length / numBars);
      const samples = Array(numBars).fill(0).map((_, i) => {
        const start = i * sampleSize;
        const end = start + sampleSize;
        const slice = data.slice(start, end);
        const average = slice.reduce((a, b) => a + b, 0) / slice.length;
        
        // Apply sensitivity multiplier and normalize to 0-1
        return Math.min(1, (average / 255) * sensitivity);
      });

      setAudioData(samples);
      animationFrameRef.current = requestAnimationFrame(analyze);
    };

    analyze();

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [isPlaying, numBars, sensitivity]);

  return { audioData };
};

export default useAudioVisualizer; 