'use client';

import React from 'react';
import Link from 'next/link';
import { Navbar } from '@/components/custom/navbar';
import { PLANS } from '@/lib/constants';
import { Check, Sparkles } from 'lucide-react';

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-black">
      <Navbar />

      <div className="pt-24 pb-20 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#6A00FF]/10 border border-[#6A00FF]/30 rounded-full text-[#C77DFF] text-sm font-medium mb-6">
              <Sparkles className="w-4 h-4" />
              Planos flexíveis
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-4">
              Escolha seu plano
            </h1>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              Comece grátis e escale conforme sua necessidade. Sem taxas ocultas.
            </p>
          </div>

          {/* Pricing Cards */}
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {PLANS.map((plan) => (
              <div
                key={plan.id}
                className={`relative p-8 rounded-3xl border transition-all duration-300 hover:scale-105 ${
                  plan.highlighted
                    ? 'bg-gradient-to-br from-[#6A00FF]/20 to-[#C77DFF]/10 border-[#6A00FF]/50 shadow-2xl shadow-[#6A00FF]/20'
                    : 'bg-white/5 backdrop-blur-sm border-white/10 hover:border-[#6A00FF]/30'
                }`}
              >
                {/* Recommended badge */}
                {plan.highlighted && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                    <div className="px-4 py-1.5 bg-gradient-to-r from-[#6A00FF] to-[#C77DFF] text-white text-sm font-semibold rounded-full">
                      Mais Popular
                    </div>
                  </div>
                )}

                {/* Plan header */}
                <div className="mb-8">
                  <h3 className="text-2xl font-bold text-white mb-2">
                    {plan.name}
                  </h3>
                  <div className="flex items-baseline gap-1 mb-4">
                    <span className="text-5xl font-bold text-white">
                      {plan.currency}{plan.price}
                    </span>
                    {plan.price > 0 && (
                      <span className="text-gray-400">/mês</span>
                    )}
                  </div>
                  <Link
                    href="/upload"
                    className={`block w-full py-3 rounded-full font-semibold text-center transition-all duration-300 ${
                      plan.highlighted
                        ? 'bg-gradient-to-r from-[#6A00FF] to-[#C77DFF] text-white hover:shadow-lg hover:shadow-[#6A00FF]/50'
                        : 'bg-white/10 text-white hover:bg-white/20'
                    }`}
                  >
                    {plan.price === 0 ? 'Começar Grátis' : 'Assinar Agora'}
                  </Link>
                </div>

                {/* Features */}
                <div className="space-y-4">
                  <div className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">
                    Recursos incluídos
                  </div>
                  {plan.features.map((feature, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <div className="w-5 h-5 rounded-full bg-[#6A00FF]/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <Check className="w-3 h-3 text-[#C77DFF]" />
                      </div>
                      <span className="text-gray-300 text-sm">{feature}</span>
                    </div>
                  ))}

                  {/* Limitations */}
                  {plan.limitations && plan.limitations.length > 0 && (
                    <>
                      <div className="border-t border-white/10 my-4" />
                      <div className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">
                        Limitações
                      </div>
                      {plan.limitations.map((limitation, index) => (
                        <div key={index} className="flex items-start gap-3">
                          <div className="w-5 h-5 rounded-full bg-white/5 flex items-center justify-center flex-shrink-0 mt-0.5">
                            <div className="w-2 h-2 bg-gray-500 rounded-full" />
                          </div>
                          <span className="text-gray-500 text-sm">{limitation}</span>
                        </div>
                      ))}
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* FAQ Section */}
          <div className="mt-20 max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold text-white text-center mb-12">
              Perguntas frequentes
            </h2>
            <div className="space-y-6">
              {faqs.map((faq, index) => (
                <div
                  key={index}
                  className="p-6 bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl"
                >
                  <h3 className="text-lg font-semibold text-white mb-2">
                    {faq.question}
                  </h3>
                  <p className="text-gray-400">
                    {faq.answer}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* CTA */}
          <div className="mt-20 text-center">
            <p className="text-gray-400 mb-6">
              Ainda tem dúvidas? Entre em contato conosco
            </p>
            <Link
              href="/"
              className="inline-flex items-center gap-2 px-8 py-3 bg-white/10 text-white rounded-full font-semibold hover:bg-white/20 transition-all duration-300"
            >
              Falar com Suporte
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

const faqs = [
  {
    question: 'Posso cancelar a qualquer momento?',
    answer: 'Sim! Você pode cancelar sua assinatura a qualquer momento sem taxas de cancelamento. Você continuará tendo acesso até o final do período pago.',
  },
  {
    question: 'Como funciona o plano gratuito?',
    answer: 'O plano gratuito oferece 20 minutos de edição por mês com resolução 720p e marca d\'água. Perfeito para testar a plataforma antes de assinar.',
  },
  {
    question: 'Posso fazer upgrade do meu plano?',
    answer: 'Sim! Você pode fazer upgrade a qualquer momento e será cobrado proporcionalmente pelo período restante.',
  },
  {
    question: 'Quais formatos de vídeo são suportados?',
    answer: 'Aceitamos MP4, MOV e WebM com tamanho máximo de 2GB por arquivo.',
  },
  {
    question: 'A IA funciona em português?',
    answer: 'Sim! Nossa IA suporta português, inglês e espanhol para transcrição, legendas e dublagem.',
  },
];
