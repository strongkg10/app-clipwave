import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { messages } = await request.json();

    // Chamar API da OpenAI
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o',
        messages: [
          {
            role: 'system',
            content: `Você é uma assistente virtual amigável e prestativa de uma plataforma de edição de vídeos com IA. Seu objetivo é ajudar os usuários com:

1. **Informações sobre o teste grátis**: 3 dias completos, acesso total, sem cobrança durante o teste
2. **Dúvidas sobre pagamento**: Não cobramos durante o teste, dados do cartão são apenas para segurança
3. **Funcionalidades**: Cortes automáticos, legendas inteligentes, dublagem com IA, templates virais, análise de performance
4. **Segurança**: Dados criptografados, privacidade garantida
5. **Suporte**: Disponível 24/7, sempre pronta para ajudar
6. **Planos**: Básico (R$ 29/mês), Pro (R$ 79/mês), Premium (R$ 149/mês)

Seja sempre positiva, use emojis quando apropriado, e incentive o usuário a testar a plataforma gratuitamente. Responda de forma clara, objetiva e amigável em português do Brasil.`,
          },
          ...messages,
        ],
        temperature: 0.7,
        max_tokens: 500,
      }),
    });

    if (!response.ok) {
      throw new Error('Erro ao chamar API da OpenAI');
    }

    const data = await response.json();
    const assistantMessage = data.choices[0].message.content;

    return NextResponse.json({ message: assistantMessage });
  } catch (error) {
    console.error('Erro na API de chat:', error);
    
    // Fallback: resposta genérica
    return NextResponse.json({
      message: '🤔 Desculpe, estou com dificuldades técnicas no momento. Mas posso ajudar com informações sobre nosso teste grátis de 3 dias, funcionalidades, pagamento e muito mais! Sobre o que você gostaria de saber?',
    });
  }
}
