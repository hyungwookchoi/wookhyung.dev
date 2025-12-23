'use client';

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from 'react';

import { calculateHash } from '../utils/bytes';

interface FileContextValue {
  file: File | null;
  fileBytes: Uint8Array | null;
  originalHash: string;
  isLoading: boolean;
  setFile: (file: File | null) => void;
}

const FileContext = createContext<FileContextValue | null>(null);

interface FileProviderProps {
  children: React.ReactNode;
}

export function FileProvider({ children }: FileProviderProps) {
  const [file, setFileState] = useState<File | null>(null);
  const [fileBytes, setFileBytes] = useState<Uint8Array | null>(null);
  const [originalHash, setOriginalHash] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const setFile = useCallback(async (newFile: File | null) => {
    if (!newFile) {
      setFileState(null);
      setFileBytes(null);
      setOriginalHash('');
      return;
    }

    setIsLoading(true);
    setFileState(newFile);

    try {
      const arrayBuffer = await newFile.arrayBuffer();
      const bytes = new Uint8Array(arrayBuffer);
      const hash = await calculateHash(arrayBuffer);

      setFileBytes(bytes);
      setOriginalHash(hash);
    } catch (error) {
      console.error('Failed to process file:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const value = useMemo(
    () => ({
      file,
      fileBytes,
      originalHash,
      isLoading,
      setFile,
    }),
    [file, fileBytes, originalHash, isLoading, setFile],
  );

  return <FileContext.Provider value={value}>{children}</FileContext.Provider>;
}

export function useSharedFile() {
  const context = useContext(FileContext);
  if (!context) {
    throw new Error('useSharedFile must be used within FileProvider');
  }
  return context;
}

export function useOptionalSharedFile() {
  return useContext(FileContext);
}
