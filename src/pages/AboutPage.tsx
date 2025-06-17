
import React from 'react';
import Header from '../components/Header';
import { Card, CardContent } from '@/components/ui/card';
import { Award, Users, Target, Heart } from 'lucide-react';

const AboutPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-indigo-900 font-inter">
      <Header title="Sobre Nós" />
      
      <div className="p-6 pb-32 space-y-6 max-w-4xl mx-auto">
        {/* Hero Section */}
        <Card className="bg-gradient-to-r from-white to-purple-50 border-0 shadow-lg">
          <CardContent className="p-6 text-center">
            <div className="mb-4">
              <div className="w-20 h-20 bg-gradient-to-br from-purple-600 to-purple-800 rounded-full flex items-center justify-center mx-auto mb-4">
                <Award className="h-10 w-10 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-purple-900 mb-2">Female Futsal</h2>
              <p className="text-purple-600 font-medium">
                Excelência, Dedicação e Paixão pelo Futsal Feminino
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Mission Section */}
        <Card className="bg-gradient-to-r from-white to-blue-50 border-0 shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                <Target className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-blue-900 mb-2">Nossa Missão</h3>
                <p className="text-blue-700 leading-relaxed">
                  Promover o desenvolvimento do futsal feminino através de treinamentos de qualidade, 
                  formando não apenas atletas excepcionais, mas também cidadãs conscientes e determinadas. 
                  Acreditamos no poder transformador do esporte na vida das nossas atletas.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Values Section */}
        <Card className="bg-gradient-to-r from-white to-green-50 border-0 shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center flex-shrink-0">
                <Heart className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-green-900 mb-2">Nossos Valores</h3>
                <div className="space-y-2 text-green-700">
                  <p><strong>Respeito:</strong> Valorizamos cada atleta como indivíduo único</p>
                  <p><strong>Dedicação:</strong> Comprometimento total com o crescimento</p>
                  <p><strong>Trabalho em Equipe:</strong> Juntas somos mais fortes</p>
                  <p><strong>Excelência:</strong> Buscamos sempre o melhor desempenho</p>
                  <p><strong>Paixão:</strong> Amor genuíno pelo futsal feminino</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Team Section */}
        <Card className="bg-gradient-to-r from-white to-orange-50 border-0 shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-orange-600 rounded-full flex items-center justify-center flex-shrink-0">
                <Users className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-orange-900 mb-2">Nossa Equipe</h3>
                <p className="text-orange-700 leading-relaxed mb-4">
                  Contamos com profissionais altamente qualificados e apaixonados pelo futsal feminino. 
                  Nossa comissão técnica é formada por treinadores experientes que dedicam seu tempo 
                  e conhecimento para o desenvolvimento integral de cada atleta.
                </p>
                
                <div className="space-y-3">
                  <div className="bg-orange-100 p-3 rounded-lg">
                    <h4 className="font-semibold text-orange-900">Treinamento Técnico</h4>
                    <p className="text-sm text-orange-700">Desenvolvimento de habilidades individuais e coletivas</p>
                  </div>
                  
                  <div className="bg-orange-100 p-3 rounded-lg">
                    <h4 className="font-semibold text-orange-900">Preparação Física</h4>
                    <p className="text-sm text-orange-700">Condicionamento físico adequado para cada faixa etária</p>
                  </div>
                  
                  <div className="bg-orange-100 p-3 rounded-lg">
                    <h4 className="font-semibold text-orange-900">Acompanhamento Psicológico</h4>
                    <p className="text-sm text-orange-700">Suporte emocional e mental para o desenvolvimento completo</p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Achievements Section */}
        <Card className="bg-gradient-to-r from-white to-purple-50 border-0 shadow-lg">
          <CardContent className="p-6">
            <h3 className="text-xl font-bold text-purple-900 mb-4 text-center">Conquistas e Reconhecimentos</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="text-center p-4 bg-purple-100 rounded-lg">
                <div className="text-2xl font-bold text-purple-900">15+</div>
                <div className="text-sm text-purple-700">Anos de tradição</div>
              </div>
              
              <div className="text-center p-4 bg-purple-100 rounded-lg">
                <div className="text-2xl font-bold text-purple-900">200+</div>
                <div className="text-sm text-purple-700">Atletas formadas</div>
              </div>
              
              <div className="text-center p-4 bg-purple-100 rounded-lg">
                <div className="text-2xl font-bold text-purple-900">50+</div>
                <div className="text-sm text-purple-700">Competições participadas</div>
              </div>
              
              <div className="text-center p-4 bg-purple-100 rounded-lg">
                <div className="text-2xl font-bold text-purple-900">25+</div>
                <div className="text-sm text-purple-700">Títulos conquistados</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Contact Section */}
        <Card className="bg-gradient-to-r from-white to-indigo-50 border-0 shadow-lg">
          <CardContent className="p-6">
            <h3 className="text-xl font-bold text-indigo-900 mb-4 text-center">Entre em Contato</h3>
            
            <div className="space-y-3 text-center">
              <p className="text-indigo-700">
                <strong>Endereço:</strong> Rua do Esporte, 123 - Centro Esportivo
              </p>
              <p className="text-indigo-700">
                <strong>Telefone:</strong> (11) 98765-4321
              </p>
              <p className="text-indigo-700">
                <strong>Email:</strong> contato@femalefutsal.com.br
              </p>
              <p className="text-indigo-700">
                <strong>Horário de Funcionamento:</strong> Segunda a Sexta, 08h às 20h
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AboutPage;
