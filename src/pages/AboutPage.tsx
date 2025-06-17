
import React from 'react';
import Header from '../components/Header';
import { Card, CardContent } from '@/components/ui/card';

const AboutPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-indigo-900 font-inter">
      <Header title="Sobre" />
      
      <div className="p-6 pb-32 space-y-6 max-w-4xl mx-auto">
        <Card className="bg-gradient-to-r from-white to-purple-50 border-0 shadow-lg">
          <CardContent className="p-6">
            <div className="text-center mb-6">
              <img 
                src="/lovable-uploads/17cdb063-665a-4886-b459-6deb3c3e1035.png" 
                alt="Female Futsal Logo" 
                className="w-32 h-32 object-contain mx-auto mb-4"
              />
              <h1 className="text-3xl font-bold text-purple-900 mb-2">FEMALE FUTSAL</h1>
            </div>
            
            <div className="space-y-6 text-purple-800">
              <div>
                <h2 className="text-xl font-bold mb-3">Nossa Missão</h2>
                <p className="text-base leading-relaxed">
                  Promover o futsal feminino através do desenvolvimento técnico, tático e humano das nossas atletas, 
                  criando um ambiente de aprendizado, crescimento e conquistas no esporte.
                </p>
              </div>

              <div>
                <h2 className="text-xl font-bold mb-3">Nossa Visão</h2>
                <p className="text-base leading-relaxed">
                  Ser referência no futsal feminino, formando atletas completas e contribuindo para o crescimento 
                  da modalidade no cenário esportivo nacional.
                </p>
              </div>

              <div>
                <h2 className="text-xl font-bold mb-3">Nossos Valores</h2>
                <ul className="list-disc list-inside space-y-2 text-base">
                  <li>Dedicação e comprometimento com o esporte</li>
                  <li>Trabalho em equipe e união</li>
                  <li>Respeito e fair play</li>
                  <li>Desenvolvimento pessoal e profissional</li>
                  <li>Excelência nos treinamentos e competições</li>
                </ul>
              </div>

              <div>
                <h2 className="text-xl font-bold mb-3">Estrutura</h2>
                <p className="text-base leading-relaxed">
                  Contamos com uma equipe técnica qualificada, instalações adequadas para treinamentos e 
                  um programa de desenvolvimento que atende atletas de diferentes níveis e idades.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AboutPage;
