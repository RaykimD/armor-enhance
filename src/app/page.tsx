'use client';
import React, { useState } from 'react';
import { Armor, ArmorStats, EnhanceLog, UsedResources, PotentialOption, ArmorTypeKorean } from '../types';

const ENHANCEMENT_COST = 3000;
const STARBALLOON_TICKET_COST = 10;
const LUCKY_STONE_BONUS = 3;
const ADVANCED_LUCKY_STONE_BONUS = 7;

const StatTypeKorean = {
   health: '체력',
   innerForce: '내공',
   luck: '운',
   attackSpeed: '공격속도',
   evasion: '회피율',
   attack: '공격력'
} as const;

const PotentialTypeKorean = {
   recovery: '회복력',
   evasion: '회피율',
   criticalChance: '치명타 확률',
   criticalDamage: '치명타 피해',
   bossDamage: '보스 공격력',
   attackSpeed: '공격속도',
   health: '체력',
   luck: '행운'
} as const;

const BASE_STATS = {
   helmet: { health: 22, innerForce: 12, luck: 0, attackSpeed: 0, evasion: 0, attack: 0 },
   armor: { health: 33, innerForce: 12, luck: 0, attackSpeed: 0, evasion: 0, attack: 0 },
   belt: { health: 12, innerForce: 11, luck: 0, attackSpeed: 0, evasion: 0, attack: 0 },
   shoes: { health: 22, innerForce: 9, luck: 0, attackSpeed: 0, evasion: 0, attack: 0 }
} as const;

const ENHANCEMENT_STATS: Record<number, Partial<ArmorStats>> = {
   1: { health: 1 },
   2: { health: 1 },
   3: { health: 1, luck: 2 },
   4: { health: 1 },
   5: { health: 1, innerForce: 1, luck: 2 },
   6: { health: 1, luck: 2 },
   7: { health: 1 },
   8: { health: 2 },
   9: { health: 2, attackSpeed: 1 },
   10: { health: 2, innerForce: 1 },
   11: { health: 2 },
   12: { health: 2, evasion: 1 },
   13: { health: 2, attackSpeed: 1 },
   14: { health: 2, evasion: 1 },
   15: { health: 3 },
   16: { health: 3, attackSpeed: 1 },
   17: { health: 6, attack: 1 },
   18: { health: 3, innerForce: 2, evasion: 1 },
   19: { health: 9 },
   20: { health: 3, attack: 1, evasion: 1 }
};

const ENHANCEMENT_RATES: Record<number, { success: number, maintain: number, degrade: number }> = {
   0: { success: 45, maintain: 16.5, degrade: 38.5 },
   1: { success: 45, maintain: 16.5, degrade: 38.5 },
   2: { success: 45, maintain: 16.5, degrade: 38.5 },
   3: { success: 45, maintain: 16.5, degrade: 38.5 },
   4: { success: 40, maintain: 18.0, degrade: 42.0 },
   5: { success: 40, maintain: 18.0, degrade: 42.0 },
   6: { success: 40, maintain: 18.0, degrade: 42.0 },
   7: { success: 35, maintain: 19.5, degrade: 45.5 },
   8: { success: 35, maintain: 19.5, degrade: 45.5 },
   9: { success: 35, maintain: 19.5, degrade: 45.5 },
   10: { success: 30, maintain: 21.0, degrade: 49.0 },
   11: { success: 30, maintain: 21.0, degrade: 49.0 },
   12: { success: 30, maintain: 21.0, degrade: 49.0 },
   13: { success: 25, maintain: 22.5, degrade: 52.5 },
   14: { success: 25, maintain: 22.5, degrade: 52.5 },
   15: { success: 25, maintain: 22.5, degrade: 52.5 },
   16: { success: 20, maintain: 24.0, degrade: 56.0 },
   17: { success: 20, maintain: 24.0, degrade: 56.0 },
   18: { success: 20, maintain: 24.0, degrade: 56.0 },
   19: { success: 15, maintain: 25.5, degrade: 59.5 },
   20: { success: 15, maintain: 25.5, degrade: 59.5 }
};

const ENHANCEMENT_DRINK_BONUS = 1;

const calculateEnhancementStats = (enhancement: number): ArmorStats => {
   const totalStats: ArmorStats = {
       health: 0,
       innerForce: 0,
       luck: 0,
       attackSpeed: 0,
       evasion: 0,
       attack: 0
   };

   for (let i = 1; i <= enhancement; i++) {
       const levelStats = ENHANCEMENT_STATS[i];
       if (levelStats) {
           Object.entries(levelStats).forEach(([stat, value]) => {
               if (value && stat in totalStats) {
                   totalStats[stat as keyof ArmorStats] += value;
               }
           });
       }
   }

   return totalStats;
};

export default function Home() {
   const [selectedArmor, setSelectedArmor] = useState<Armor | null>(null);
   const [enhanceLogs, setEnhanceLogs] = useState<EnhanceLog[]>([]);
   const [usedResources, setUsedResources] = useState<UsedResources>({
       money: 0,
       luckyStone: 0,
       advancedLuckyStone: 0,
       starBalloonTicket: 0
   });
   const [drinkUsed, setDrinkUsed] = useState<boolean>(false);

   const selectArmor = (type: keyof typeof BASE_STATS) => {
       const newArmor: Armor = {
           id: `${type}_${Date.now()}`,
           type: type,
           enhancement: 0,
           baseStats: BASE_STATS[type],
           enhanceStats: {
               health: 0,
               innerForce: 0,
               luck: 0,
               attackSpeed: 0,
               evasion: 0,
               attack: 0
           },
           potentials: []
       };
       setSelectedArmor(newArmor);
   };

   const handleEnhance = (enhanceType: 'normal' | 'lucky' | 'advancedLucky') => {
       if (!selectedArmor || selectedArmor.enhancement >= 20) return;

       setUsedResources(prev => ({
           ...prev,
           money: prev.money + ENHANCEMENT_COST,
           luckyStone: prev.luckyStone + (enhanceType === 'lucky' ? 1 : 0),
           advancedLuckyStone: prev.advancedLuckyStone + (enhanceType === 'advancedLucky' ? 1 : 0)
       }));

       let successRate = ENHANCEMENT_RATES[selectedArmor.enhancement].success;
       if (drinkUsed) successRate += ENHANCEMENT_DRINK_BONUS;
       if (enhanceType === 'lucky') successRate += LUCKY_STONE_BONUS;
       if (enhanceType === 'advancedLucky') successRate += ADVANCED_LUCKY_STONE_BONUS;

       const roll = Math.random() * 100;
       const log: EnhanceLog = {
           type: 'maintain',
           armorType: selectedArmor.type,
           enhancement: selectedArmor.enhancement,
           timestamp: Date.now()
       };

       if (roll < successRate) {
           setSelectedArmor(prev => prev && ({
               ...prev,
               enhancement: prev.enhancement + 1,
               enhanceStats: calculateEnhancementStats(prev.enhancement + 1)
           }));
           log.type = 'success';
           log.enhancement += 1;
       } else if (roll < successRate + ENHANCEMENT_RATES[selectedArmor.enhancement].degrade) {
           const newEnhancement = Math.max(0, selectedArmor.enhancement - 1);
           setSelectedArmor(prev => prev && ({
               ...prev,
               enhancement: newEnhancement,
               enhanceStats: calculateEnhancementStats(newEnhancement)
           }));
           log.type = 'degrade';
           log.enhancement = Math.max(0, log.enhancement - 1);
       }

       setEnhanceLogs(prev => [log, ...prev].slice(0, 5));
   };

   const rerollPotentials = () => {
       if (!selectedArmor) return;

       setUsedResources(prev => ({
           ...prev,
           starBalloonTicket: prev.starBalloonTicket + STARBALLOON_TICKET_COST
       }));

       const roll = Math.random() * 100;
       const lineCount = roll < 25 ? 1 : roll < 60 ? 2 : 3;
       const newPotentials: PotentialOption[] = [];

       for (let i = 0; i < lineCount; i++) {
           const potentialTypes = ['recovery', 'evasion', 'criticalChance', 'criticalDamage',
               'bossDamage', 'attackSpeed', 'health', 'luck'] as const;
           const selectedType = potentialTypes[Math.floor(Math.random() * potentialTypes.length)];

           let value: number;
           switch (selectedType) {
               case 'recovery':
                   value = [3, 6, 9][Math.floor(Math.random() * 3)];
                   break;
               case 'evasion':
               case 'attackSpeed':
                   value = Math.floor(Math.random() * 3) + 2;
                   break;
               case 'bossDamage':
                   value = [2, 4, 6, 8][Math.floor(Math.random() * 4)];
                   break;
               case 'luck':
                   value = [2, 4, 6][Math.floor(Math.random() * 3)];
                   break;
               default:
                   value = Math.floor(Math.random() * 4) + 1;
           }

           newPotentials.push({ type: selectedType, value });
       }

       setSelectedArmor(prev => prev && ({
           ...prev,
           potentials: newPotentials
       }));
   };

return (
       <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 p-4">
           <div className="max-w-7xl mx-auto">
               <div className="flex justify-between items-center mb-8">
                   {!selectedArmor ? (
                       <button
                           onClick={() => window.location.href = 'https://kochang-simulator.onrender.com/'}
                           className="text-gray-400 hover:text-white text-sm transition-colors duration-200"
                       >
                           ← 돌아가기
                       </button>
                   ) : (
                       <button
                           onClick={() => setSelectedArmor(null)}
                           className="text-gray-400 hover:text-white text-sm transition-colors duration-200"
                       >
                           ← 돌아가기
                       </button>
                   )}
                   <h1 className="text-3xl font-bold text-white text-center">코창서버 방어구 강화 시뮬레이터</h1>
                   <button
                       onClick={() => {
                           if (confirm('현재 장비가 초기화됩니다. 계속하시겠습니까?')) {
                               if (selectedArmor) {
                                   setSelectedArmor(prev => prev && ({
                                       ...prev,
                                       enhancement: 0,
                                       enhanceStats: calculateEnhancementStats(0),
                                       potentials: []
                                   }));
                                   setEnhanceLogs([]);
                                   setUsedResources({
                                       money: 0,
                                       luckyStone: 0,
                                       advancedLuckyStone: 0,
                                       starBalloonTicket: 0
                                   });
                                   setDrinkUsed(false);
                               }
                           }
                       }}
                       className="text-gray-400 hover:text-white text-sm transition-colors duration-200"
                   >
                       초기화
                   </button>
               </div>

               {!selectedArmor ? (
                   <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                       {Object.entries(ArmorTypeKorean).map(([type, name]) => (
                           <button
                               key={type}
                               onClick={() => selectArmor(type as keyof typeof BASE_STATS)}
                               className="bg-gray-800 rounded-xl p-6 border border-gray-700 hover:border-blue-500 transition-colors duration-200"
                           >
                               <h2 className="text-xl font-bold text-white">{name}</h2>
                               <p className="text-gray-400">강화하기</p>
                           </button>
                       ))}
                   </div>
               ) : (
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                       <div className="space-y-6">
                           {/* 장비 정보 */}
                           <div className="bg-gray-800 rounded-xl p-6 border border-gray-700 h-[600px]">
                               <div className="flex justify-between items-center">
                                   <h2 className="text-2xl font-bold text-white">장비 정보</h2>
                               </div>
                               <p className="text-lg font-semibold text-white mt-4">
                                   +{selectedArmor.enhancement} {ArmorTypeKorean[selectedArmor.type]}
                                   {selectedArmor.enhancement === 20 && <span className="text-sm text-gray-400 ml-2">(예상)</span>}
                               </p>
                               <div className="border-t border-gray-700 pt-4 mt-4">
                                   <p className="text-sm text-gray-500 mb-2">기본 스탯</p>
                                   {Object.entries(selectedArmor.baseStats).map(([stat, value]) => (
                                       value > 0 && (
                                           <p key={stat} className="text-gray-300">
                                               {StatTypeKorean[stat as keyof typeof StatTypeKorean]}: +{value}
                                           </p>
                                       )
                                   ))}
                               </div>
                               <div className="border-t border-gray-700 pt-4 mt-4">
                                   <p className="text-sm text-gray-500 mb-2">강화 스탯</p>
                                   {Object.entries(selectedArmor.enhanceStats).map(([stat, value]) => (
                                       value > 0 && (
                                           <p key={stat} className="text-gray-300">
                                               {StatTypeKorean[stat as keyof typeof StatTypeKorean]}: +{value}
                                           </p>
                                       )
                                   ))}
                               </div>
                               {selectedArmor.potentials.length > 0 && (
                                   <div className="border-t border-gray-700 pt-4 mt-4">
                                       <p className="text-sm text-gray-500 mb-2">잠재능력</p>
                                       {selectedArmor.potentials.map((potential, index) => (
                                           <p key={index} className="text-gray-300">
                                               {PotentialTypeKorean[potential.type]} +{potential.value}
                                           </p>
                                       ))}
                                   </div>
                               )}
                           </div>

                           {/* 강화주 버튼 추가 */}
                           <div className="bg-gray-800 rounded-xl p-4 border border-gray-700">
                               <button
                                   onClick={() => setDrinkUsed(prev => !prev)}
                                   className={`w-full ${drinkUsed
                                           ? 'bg-amber-600 hover:bg-amber-500'
                                           : 'bg-amber-700 hover:bg-amber-600'
                                       } text-white rounded-lg py-2 transition-colors duration-200`}
                               >
                                   강화주 {drinkUsed ? '사용 중 (+1%)' : '마시기'}
                               </button>
                           </div>

                           {/* 강화 UI */}
                           <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
                               <h2 className="text-2xl font-bold text-white mb-4">강화</h2>
                               <div className="grid grid-cols-3 gap-4">
                                   <button
                                       onClick={() => handleEnhance('normal')}
                                       className="bg-blue-600 hover:bg-blue-500 text-white rounded-lg py-2 px-4"
                                   >
                                       일반 강화
                                       <span className="block text-sm text-blue-200">3,000원</span>
                                   </button>
                                   <button
                                       onClick={() => handleEnhance('lucky')}
                                       className="bg-green-600 hover:bg-green-500 text-white rounded-lg py-2 px-4"
                                   >
                                       행운 강화
                                       <span className="block text-sm text-green-200">+3%</span>
                                   </button>
                                   <button
                                       onClick={() => handleEnhance('advancedLucky')}
                                       className="bg-purple-600 hover:bg-purple-500 text-white rounded-lg py-2 px-4"
                                   >
                                       고급 행운 강화
                                       <span className="block text-sm text-purple-200">+7%</span>
                                   </button>
                               </div>
                           </div>

                           {/* 잠재능력 UI */}
                           <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
                               <h2 className="text-2xl font-bold text-white mb-4">잠재능력</h2>
                               <button
                                   onClick={rerollPotentials}
                                   className="w-full bg-yellow-600 hover:bg-yellow-500 text-white rounded-lg py-2 transition-colors duration-200"
                               >
                                   잠재능력 리롤 (별풍선 티켓 10개)
                               </button>
                           </div>
                       </div>

                       {/* 우측 영역 - 강화 확률, 로그, 사용된 재화 */}
                       <div className="space-y-6">
                           <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
                               <h2 className="text-2xl font-bold text-white mb-4">강화 등급 이동</h2>
                               <div className="flex items-center space-x-4">
                                   <button 
                                       onClick={() => {
                                           if (selectedArmor && selectedArmor.enhancement > 0) {
                                               setSelectedArmor(prev => prev && ({
                                                   ...prev,
                                                   enhancement: prev.enhancement - 1,
                                                   enhanceStats: calculateEnhancementStats(prev.enhancement - 1)
                                               }));
                                           }
                                       }}
                                       className="text-white hover:text-gray-300"
                                       disabled={!selectedArmor || selectedArmor.enhancement <= 0}
                                   >
                                       &lt;
                                   </button>
                                   <select 
                                       value={selectedArmor?.enhancement || 0}
                                       onChange={(e) => {
                                           const newEnhancement = Number(e.target.value);
                                           setSelectedArmor(prev => prev && ({
                                               ...prev,
                                               enhancement: newEnhancement,
                                               enhanceStats: calculateEnhancementStats(newEnhancement)
                                           }));
                                       }}
                                       className="bg-gray-700 text-white px-4 py-2 rounded-lg flex-grow text-center"
                                       disabled={!selectedArmor}
                                   >
                                       {Array.from({length: 21}, (_, i) => (
                                           <option key={i} value={i}>{i}강{i === 20 ? ' (예상)' : ''}</option>
                                       ))}
                                   </select>
                                   <button 
                                       onClick={() => {
                                           if (selectedArmor && selectedArmor.enhancement < 20) {
                                               setSelectedArmor(prev => prev && ({
                                                   ...prev,
                                                   enhancement: prev.enhancement + 1,
                                                   enhanceStats: calculateEnhancementStats(prev.enhancement + 1)
                                               }));
                                           }
                                       }}
                                       className="text-white hover:text-gray-300"
                                       disabled={!selectedArmor || selectedArmor.enhancement >= 20}
                                   >
                                       &gt;
                                   </button>
                               </div>
                           </div>

                           <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
                               <h2 className="text-2xl font-bold text-white mb-4">강화 확률</h2>
                               <div className="text-gray-300">
                                   <p>성공: {(ENHANCEMENT_RATES[selectedArmor.enhancement].success + (drinkUsed ? ENHANCEMENT_DRINK_BONUS : 0))}%</p>
                                   <p>유지: {ENHANCEMENT_RATES[selectedArmor.enhancement].maintain}%</p>
                                   <p>하락: {ENHANCEMENT_RATES[selectedArmor.enhancement].degrade}%</p>
                                   {drinkUsed && <p className="text-amber-400 text-sm mt-2">강화주 효과 적용 중 (+1%)</p>}
                               </div>
                           </div>

                           <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
                               <h2 className="text-2xl font-bold text-white mb-4">강화 로그</h2>
                               <div className="space-y-2">
                                   {enhanceLogs.map((log) => (
                                       <div
                                           key={log.timestamp}
                                           className={`text-sm ${log.type === 'success' ? 'text-green-400' :
                                               log.type === 'degrade' ? 'text-red-400' :
                                                   'text-gray-400'
                                               }`}
                                       >
                                           {ArmorTypeKorean[log.armorType]} {
                                               log.type === 'success' ? `${log.enhancement}강 강화 성공` :
                                                   log.type === 'degrade' ? `${log.enhancement + 1}강에서 ${log.enhancement}강으로 하락` :
                                                       `${log.enhancement}강 유지`
                                           }
                                       </div>
                                   ))}
                               </div>
                           </div>

                           <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
                               <h2 className="text-2xl font-bold text-white mb-4">사용된 재화</h2>
                               <div className="space-y-2 text-gray-300">
                                   <p>총 사용 금액: {usedResources.money.toLocaleString()}원</p>
                                   <p>행운 재련석: {usedResources.luckyStone}개</p>
                                   <p>고급 행운 재련석: {usedResources.advancedLuckyStone}개</p>
                                   <p>별풍선 티켓: {usedResources.starBalloonTicket}개</p>
                               </div>
                           </div>
                       </div>
                   </div>
               )}
           </div>
       </div>
   );
}
