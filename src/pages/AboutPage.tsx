
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
                <h2 className="text-xl font-bold mb-3 text-center bg-purple-200 rounded-lg py-2 text-purple-900">
                  NOSSA HISTÓRIA
                </h2>
                <p className="text-base leading-relaxed text-justify">
                  A ASSOCIAÇÃO FEMALE FUTSAL É SUCESSORA DO POPIOLSKI FUTEBOL CLUBE. SUA ATUAÇÃO NO FUTSAL FEMININO SE COMPÕE DE ATLETAS QUE SE FUNDE COM O INÍCIO DA PRÁTICA DA MODALIDADE NO MUNICÍPIO.
                </p>
                <p className="text-base leading-relaxed text-justify mt-4">
                  NO INÍCIO DA DÉCADA DE 1990, UM GRUPO DE MULHERES, LIDERADAS PELA SRA. CATARINA REATTO POPIOLSKI, PASSARAM A SE REUNIR PARA DESFRUTAR DO JOGO NOS HORÁRIOS DE LAZER E FORAM CONQUISTANDO MAIS ADEPTAS DO JOGO DAS QUADRAS EM CHAPECÓ.
                </p>
                <p className="text-base leading-relaxed text-justify mt-4">
                  LOGO SURGIRAM OUTROS GRUPOS NA CIDADE PARA PRATICAR A MODALIDADE, O QUE ATRAIU A REALIZAÇÃO DE CAMPEONATOS E TORNEIOS.
                </p>
              </div>

              <div>
                <h2 className="text-xl font-bold mb-3 text-center bg-purple-200 rounded-lg py-2 text-purple-900">
                  PRINCIPAIS TÍTULOS
                </h2>
                <div className="space-y-2 text-base text-center">
                  <p className="font-semibold">3X CAMPEÃO MUNDIAL COPA DAS NAÇÕES</p>
                  <p className="font-semibold">2X CAMPEÃO DA LIBERTADORES</p>
                  <p className="font-semibold">6X CAMPEÃO DA LIGA NACIONAL</p>
                  <p className="font-semibold">7X CAMPEÃO DA TAÇA BRASIL</p>
                  <p className="font-semibold">9X CAMPEÃO CATARINENSE</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="text-center">
                  <div className="bg-purple-200 rounded-lg py-2 mb-2">
                    <h3 className="text-lg font-bold text-purple-900">TELEFONE</h3>
                  </div>
                  <p className="font-semibold text-purple-900">(49) 99911-0313</p>
                </div>
                
                <div className="text-center">
                  <div className="bg-purple-200 rounded-lg py-2 mb-2">
                    <h3 className="text-lg font-bold text-purple-900">EMAIL</h3>
                  </div>
                  <p className="font-semibold text-purple-900 break-all">FEMALEFUT@GMAIL.COM</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AboutPage;
