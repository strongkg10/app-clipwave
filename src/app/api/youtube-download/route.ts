import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { url, quality, format } = await request.json();

    if (!url) {
      return NextResponse.json(
        { error: 'URL do vídeo é obrigatória' },
        { status: 400 }
      );
    }

    // Extrair o ID do vídeo do YouTube
    const videoId = extractVideoId(url);
    if (!videoId) {
      return NextResponse.json(
        { error: 'URL inválida do YouTube' },
        { status: 400 }
      );
    }

    // Usar API pública para obter informações do vídeo
    const infoResponse = await fetch(
      `https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${videoId}&format=json`
    );

    if (!infoResponse.ok) {
      return NextResponse.json(
        { error: 'Não foi possível obter informações do vídeo' },
        { status: 400 }
      );
    }

    const videoInfo = await infoResponse.json();

    // Retornar informações do vídeo e URL de download
    // Nota: Para download real, você precisaria de um serviço backend ou API externa
    return NextResponse.json({
      success: true,
      videoInfo: {
        title: videoInfo.title,
        author: videoInfo.author_name,
        thumbnail: videoInfo.thumbnail_url,
        videoId: videoId,
      },
      downloadUrl: `https://www.youtube.com/watch?v=${videoId}`,
      message: 'Use uma extensão de navegador ou serviço externo para download',
    });
  } catch (error) {
    console.error('Erro ao processar download:', error);
    return NextResponse.json(
      { error: 'Erro ao processar o download' },
      { status: 500 }
    );
  }
}

function extractVideoId(url: string): string | null {
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/,
    /youtube\.com\/embed\/([^&\n?#]+)/,
    /youtube\.com\/v\/([^&\n?#]+)/,
  ];

  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match && match[1]) {
      return match[1];
    }
  }

  return null;
}
