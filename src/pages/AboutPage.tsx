
import React from 'react';
import Header from '../components/Header';
import { Card, CardContent } from '@/components/ui/card';

const AboutPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-indigo-900 font-inter">
      <Header title="Sobre" />
      
      <div className="pt-20 p-6 pb-32 space-y-6 max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <img 
            src="/lovable-uploads/17cdb063-665a-4886-b459-6deb3c3e1035.png" 
            alt="Female Futsal Logo" 
            className="w-40 h-40 object-contain mx-auto mb-6"
          />
          <h1 className="text-4xl font-bold text-white mb-2">FEMALE FUTSAL</h1>
          <p className="text-purple-200 text-lg">Associação Esportiva</p>
        </div>

        <Card className="bg-gradient-to-r from-white to-purple-50 border-0 shadow-lg mb-6">
          <CardContent className="p-8">
            <div className="space-y-8 text-purple-800">
              <div>
                <div className="flex items-center justify-center mb-6">
                  <div className="bg-gradient-to-r from-purple-600 to-purple-800 rounded-full p-4">
                    <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                </div>
                <h2 className="text-2xl font-bold mb-6 text-center bg-gradient-to-r from-purple-600 to-purple-800 text-white rounded-lg py-3">
                  NOSSA HISTÓRIA
                </h2>
                <div className="space-y-4 text-base leading-relaxed">
                  <p className="text-justify">
                    A <strong>ASSOCIAÇÃO FEMALE FUTSAL</strong> é sucessora do Popiolski Futebol Clube. 
                    Sua atuação no futsal feminino se compõe de atletas que se funde com o início da 
                    prática da modalidade no município.
                  </p>
                  <p className="text-justify">
                    No início da década de 1990, um grupo de mulheres, lideradas pela Sra. Catarina 
                    Reatto Popiolski, passaram a se reunir para desfrutar do jogo nos horários de lazer 
                    e foram conquistando mais adeptas do jogo das quadras em Chapecó.
                  </p>
                  <p className="text-justify">
                    Logo surgiram outros grupos na cidade para praticar a modalidade, o que atraiu 
                    a realização de campeonatos e torneios.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-white to-purple-50 border-0 shadow-lg mb-6">
          <CardContent className="p-8">
            <div className="flex items-center justify-center mb-6">
              <div className="bg-gradient-to-r from-yellow-500 to-yellow-600 rounded-full p-4">
                <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              </div>
            </div>
            <h2 className="text-2xl font-bold mb-6 text-center bg-gradient-to-r from-yellow-500 to-yellow-600 text-white rounded-lg py-3">
              PRINCIPAIS TÍTULOS
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-purple-100 rounded-lg p-4 text-center">
                <div className="text-3xl font-bold text-purple-800 mb-1">3X</div>
                <p className="font-semibold text-purple-700">CAMPEÃO MUNDIAL COPA DAS NAÇÕES</p>
              </div>
              <div className="bg-purple-100 rounded-lg p-4 text-center">
                <div className="text-3xl font-bold text-purple-800 mb-1">2X</div>
                <p className="font-semibold text-purple-700">CAMPEÃO DA LIBERTADORES</p>
              </div>
              <div className="bg-purple-100 rounded-lg p-4 text-center">
                <div className="text-3xl font-bold text-purple-800 mb-1">6X</div>
                <p className="font-semibold text-purple-700">CAMPEÃO DA LIGA NACIONAL</p>
              </div>
              <div className="bg-purple-100 rounded-lg p-4 text-center">
                <div className="text-3xl font-bold text-purple-800 mb-1">7X</div>
                <p className="font-semibold text-purple-700">CAMPEÃO DA TAÇA BRASIL</p>
              </div>
              <div className="bg-purple-100 rounded-lg p-4 text-center md:col-span-2">
                <div className="text-3xl font-bold text-purple-800 mb-1">9X</div>
                <p className="font-semibold text-purple-700">CAMPEÃO CATARINENSE</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-white to-purple-50 border-0 shadow-lg">
          <CardContent className="p-8">
            <div className="flex items-center justify-center mb-6">
              <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-full p-4">
                <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                  <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                </svg>
              </div>
            </div>
            <h2 className="text-2xl font-bold mb-6 text-center bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg py-3">
              CONTATO
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="text-center bg-purple-100 rounded-lg p-6">
                <div className="bg-purple-600 rounded-full p-3 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                  <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                  </svg>
                </div>
                <h3 className="text-lg font-bold text-purple-900 mb-2">TELEFONE</h3>
                <p className="font-semibold text-purple-800 text-lg">(49) 99911-0313</p>
              </div>
              
              <div className="text-center bg-purple-100 rounded-lg p-6">
                <div className="bg-purple-600 rounded-full p-3 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                  <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                    <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                  </svg>
                </div>
                <h3 className="text-lg font-bold text-purple-900 mb-2">EMAIL</h3>
                <p className="font-semibold text-purple-800 break-all">FEMALEFUT@GMAIL.COM</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AboutPage;
