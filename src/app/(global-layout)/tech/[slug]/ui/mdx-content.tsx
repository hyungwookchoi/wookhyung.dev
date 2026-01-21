'use client';

import Image from 'next/image';
import { getMDXComponent } from 'next-contentlayer2/hooks';

import {
  AttestationSimulator,
  EthereumPosPlayground,
  RandaoVisualization,
  RewardCalculator,
  SlashingPenaltyDemo,
  SlotEpochVisualizer,
} from '@/features/ethereum-pos';
import {
  ByteInterpretationDemo,
  ETagVisualization,
  FileProvider,
  HexDumpExplorer,
  MultipartProcessDemo,
  MultipartUploadSimulator,
  MultipartVerifier,
  PresignedUrlFlowDemo,
} from '@/features/s3-multipart';
import { ScriptExecutionFlow } from '@/features/script-execution-flow/components';

interface MDXContentProps {
  code: string;
}

export function MDXContent({ code }: MDXContentProps) {
  const Content = getMDXComponent(code);

  // Note: LocaleProvider is already provided by the root layout
  // No need to wrap again here
  return (
    <Content
      components={{
        Image,
        // Ethereum PoS components
        EthereumPosPlayground,
        SlotEpochVisualizer,
        RandaoVisualization,
        AttestationSimulator,
        RewardCalculator,
        SlashingPenaltyDemo,
        // S3 Multipart components
        MultipartUploadSimulator,
        MultipartProcessDemo,
        ETagVisualization,
        HexDumpExplorer,
        ByteInterpretationDemo,
        MultipartVerifier,
        FileProvider,
        PresignedUrlFlowDemo,
        // Script Execution Flow components
        ScriptExecutionFlow,
      }}
    />
  );
}
