// ClipWave - Constants

import { Plan } from './types';

export const BRAND = {
  name: 'ClipWave',
  tagline: 'Edição de vídeos automática com IA',
  colors: {
    primary: '#6A00FF',
    primaryLight: '#C77DFF',
    black: '#000000',
    white: '#FFFFFF',
  },
} as const;

export const PLANS: Plan[] = [
  {
    id: 'free',
    name: 'Free',
    price: 0,
    currency: 'R$',
    features: [
      '20 minutos de edição por mês',
      'Resolução 720p',
      'Legendas automáticas',
      'Cortes automáticos',
    ],
    limitations: [
      'Marca d\'água ClipWave',
      'Exportação limitada',
    ],
  },
  {
    id: 'pro',
    name: 'Pro',
    price: 39,
    currency: 'R$',
    features: [
      'Edição ilimitada',
      'Resolução 1080p',
      'Legendas virais estilizadas',
      'Templates premium',
      'Highlights automáticos',
      'Exportação rápida',
    ],
    highlighted: true,
  },
  {
    id: 'creator',
    name: 'Creator',
    price: 89,
    currency: 'R$',
    features: [
      'Tudo do Pro +',
      'Resolução 4K',
      'B-roll automático com IA',
      'Dublagem em 3 idiomas',
      'Clonagem de voz',
      'Sem marca d\'água',
      'Suporte prioritário',
      'API de acesso',
    ],
  },
];

export const SUPPORTED_VIDEO_FORMATS = [
  'video/mp4',
  'video/quicktime', // MOV
  'video/webm',
] as const;

export const MAX_FILE_SIZE = 2 * 1024 * 1024 * 1024; // 2GB

export const PROCESSING_STEPS = [
  {
    id: 'upload',
    name: 'Upload',
    description: 'Enviando vídeo para a nuvem',
  },
  {
    id: 'transcription',
    name: 'Transcrição',
    description: 'Extraindo áudio e gerando legendas com IA',
  },
  {
    id: 'analysis',
    name: 'Análise',
    description: 'Detectando melhores momentos e pausas',
  },
  {
    id: 'editing',
    name: 'Edição',
    description: 'Aplicando cortes e efeitos automáticos',
  },
  {
    id: 'rendering',
    name: 'Renderização',
    description: 'Gerando vídeo final em alta qualidade',
  },
] as const;

export const ONBOARDING_STEPS = [
  {
    title: 'Bem-vindo ao ClipWave',
    description: 'Edite vídeos curtos automaticamente com inteligência artificial',
    icon: '🎬',
  },
  {
    title: 'Upload Simples',
    description: 'Arraste seu vídeo e deixe a IA fazer o trabalho pesado',
    icon: '📤',
  },
  {
    title: 'Edição Automática',
    description: 'Legendas, cortes, highlights e muito mais em segundos',
    icon: '✨',
  },
  {
    title: 'Exporte e Compartilhe',
    description: 'Baixe em 1080p, 4K e compartilhe direto nas redes sociais',
    icon: '🚀',
  },
] as const;
