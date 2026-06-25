import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Scenario, ScenarioResponse } from '../models/scenario.model';
import { SessionStateService } from './session-state.service';

@Injectable({
  providedIn: 'root'
})
export class ScenarioService {
  private scenarios: Scenario[] = [
    {
      id: 'scen-001',
      title: 'La inversión',
      context: 'El fondo del club de ciencias de la escuela ha acumulado un excedente significativo. Como tesorero, debes decidir cómo utilizar este dinero: invertirlo en un proyecto tecnológico estudiantil innovador pero riesgoso, colocarlo en un fondo de bajo riesgo para comprar materiales esenciales garantizados, o mantenerlo en efectivo para evitar cualquier fluctuación.',
      difficultyLevel: 'medium',
      options: [
        {
          id: 'opt-001-a',
          code: 'A',
          text: 'Invertir todo en el proyecto tecnológico estudiantil para buscar el mayor beneficio.',
          narrativeConsequence: 'El proyecto tecnológico fracasa a mitad de año debido a problemas de diseño y falta de pruebas. El club pierde el 80% de sus fondos excedentes, lo que les impide comprar materiales básicos para las ferias científicas. Esto demuestra una alta tolerancia al riesgo pero baja coherencia financiera.'
        },
        {
          id: 'opt-001-b',
          code: 'B',
          text: 'Colocar el dinero en el fondo de bajo riesgo para comprar materiales esenciales.',
          narrativeConsequence: 'El fondo rinde lo esperado. Se compran los materiales básicos y el club mantiene su funcionamiento normal sin contratiempos. Es una decisión balanceada que demuestra una coherencia ética media y una consistencia razonable.'
        },
        {
          id: 'opt-001-c',
          code: 'C',
          text: 'Guardar el dinero en la caja de seguridad en efectivo para evitar cualquier pérdida.',
          narrativeConsequence: 'El dinero pierde valor real frente al alza de precios de los insumos y no se compra ningún material nuevo. Aunque el riesgo asumido es cero, la consistencia a largo plazo es baja, ya que el dinero se devalúa de forma pasiva.'
        }
      ]
    },
    {
      id: 'scen-002',
      title: 'El informe confidencial',
      context: 'Descubres un informe confidencial que revela que el proyecto escolar estrella de tu mejor amigo contiene plagio involuntario. El informe se publicará oficialmente en dos días, lo que afectará de inmediato su postulación a una beca universitaria crucial.',
      difficultyLevel: 'hard',
      options: [
        {
          id: 'opt-002-a',
          code: 'A',
          text: 'Denunciar el plagio de inmediato ante el comité escolar para mantener la transparencia académica.',
          narrativeConsequence: 'La reputación de tu amigo se arruina y pierde la beca de inmediato. Aunque actuaste con coherencia institucional extrema, el riesgo interpersonal fue alto y la empatía fue baja.'
        },
        {
          id: 'opt-002-b',
          code: 'B',
          text: 'Hablar a solas con tu amigo para que corrija el informe y lo presente de nuevo antes de la publicación.',
          narrativeConsequence: 'Tu amigo agradece tu honestidad y corrige el error a tiempo. Se evita el escándalo y se mantiene la integridad del proyecto. Esta opción equilibró la coherencia ética y redujo el riesgo de manera consistente.'
        },
        {
          id: 'opt-002-c',
          code: 'C',
          text: 'Destruir la copia física del informe que encontraste y guardar silencio para proteger a tu amigo.',
          narrativeConsequence: 'El plagio es descubierto semanas después por un evaluador externo. Las consecuencias son graves para tu amigo (expulsión) y para ti por complicidad. Muestra alto riesgo de negligencia y baja consistencia.'
        }
      ]
    },
    {
      id: 'scen-003',
      title: 'El equipo en crisis',
      context: 'En el trabajo de investigación final del año, dos miembros clave de tu equipo se niegan a colaborar debido a un desacuerdo sobre quién debe realizar la presentación principal. El plazo de entrega vence mañana por la mañana.',
      difficultyLevel: 'medium',
      options: [
        {
          id: 'opt-003-a',
          code: 'A',
          text: 'Excluir a ambos del grupo y entregar solo el avance que tú realizaste.',
          narrativeConsequence: 'Presentas un trabajo incompleto. El profesor penaliza a todo el grupo con baja nota. Tu consistencia bajo presión fue baja y el riesgo de reprobar aumentó innecesariamente.'
        },
        {
          id: 'opt-003-b',
          code: 'B',
          text: 'Dividir la presentación en partes equitativas para que todos expongan y mediar la conversación.',
          narrativeConsequence: 'El equipo logra ponerse de acuerdo y expone con éxito. Lograste coherencia en la gestión de conflictos y consistencia organizativa bajo presión.'
        },
        {
          id: 'opt-003-c',
          code: 'C',
          text: 'Hacer toda la presentación tú mismo y colocar los nombres de todos para evitar discusiones.',
          narrativeConsequence: 'Entregas el trabajo y obtienen buena nota, pero asumes todo el desgaste físico y mental. Esto fomenta la irresponsabilidad y muestra una alta aversión al conflicto.'
        }
      ]
    },
    {
      id: 'scen-004',
      title: 'La votación del grupo',
      context: 'Tu sección de grado debe elegir el destino del viaje de estudios de fin de año. La mitad de los alumnos quiere ir a un museo de ciencias interactivo y la otra mitad a un parque de diversiones tecnológico. Tu voto decidirá la elección.',
      difficultyLevel: 'easy',
      options: [
        {
          id: 'opt-004-a',
          code: 'A',
          text: 'Votar por el museo de ciencias para priorizar el valor educativo.',
          narrativeConsequence: 'El viaje es educativo pero una parte significativa del grupo se siente aburrida y frustrada. Mostraste una alta coherencia académica pero bajo consenso social.'
        },
        {
          id: 'opt-004-b',
          code: 'B',
          text: 'Proponer un itinerario mixto: mañana de museo y tarde de parque.',
          narrativeConsequence: 'Se aprueba por unanimidad la propuesta combinada. Todos los alumnos quedan satisfechos y se logran ambos objetivos. Alta consistencia y bajo riesgo de desunión.'
        },
        {
          id: 'opt-004-c',
          code: 'C',
          text: 'Abstenerte de votar para no enemistarte con ningún compañero.',
          narrativeConsequence: 'La decisión se retrasa, se pierden las reservas de transporte y el viaje se cancela. Ambos grupos se frustran contigo. Muestra baja consistencia y alto riesgo pasivo.'
        }
      ]
    },
    {
      id: 'scen-005',
      title: 'El presupuesto del aula',
      context: 'El comité estudiantil dispone de un fondo limitado para mejorar el salón. Algunos sugieren comprar luces LED de colores para darle un aspecto moderno, mientras que otros prefieren reparar la estantería de libros dañada.',
      difficultyLevel: 'easy',
      options: [
        {
          id: 'opt-005-a',
          code: 'A',
          text: 'Comprar las luces LED decorativas para mejorar el aspecto visual del salón.',
          narrativeConsequence: 'El salón se ve vistoso para las visitas, pero los libros de texto continúan deteriorándose en el suelo. Indica baja coherencia utilitaria y priorización de lo estético.'
        },
        {
          id: 'opt-005-b',
          code: 'B',
          text: 'Adquirir estantes económicos de melamina y luces sencillas con el saldo restante.',
          narrativeConsequence: 'El aula queda organizada y con una iluminación agradable. Decisión balanceada que optimiza los recursos de forma coherente.'
        },
        {
          id: 'opt-005-c',
          code: 'C',
          text: 'Invertir todo el dinero en restaurar los libros y comprar un estante de madera sólida.',
          narrativeConsequence: 'Se prioriza la conservación del material educativo. El aula no tiene decoraciones pero la biblioteca se recupera por completo, mostrando alta coherencia académica.'
        }
      ]
    },
    {
      id: 'scen-006',
      title: 'El dilema del examen',
      context: 'Durante un examen final de matemáticas, notas que el alumno con las mejores calificaciones del salón está utilizando apuntes prohibidos ocultos en su cartuchera.',
      difficultyLevel: 'medium',
      options: [
        {
          id: 'opt-006-a',
          code: 'A',
          text: 'Informar al profesor en voz alta en el mismo instante.',
          narrativeConsequence: 'El profesor anula el examen del alumno. Te ganas la enemistad de tus compañeros por delatarlo públicamente. Muestra alta coherencia con las normas pero alto riesgo social.'
        },
        {
          id: 'opt-006-b',
          code: 'B',
          text: 'Hablar con el alumno al finalizar el examen y pedirle que le diga la verdad al profesor.',
          narrativeConsequence: 'El alumno reflexiona y habla con el profesor de forma privada para rendir un examen de recuperación. Muestra una excelente consistencia moral y bajo riesgo destructivo.'
        },
        {
          id: 'opt-006-c',
          code: 'C',
          text: 'Ignorar la situación para evitar problemas de cualquier tipo.',
          narrativeConsequence: 'El alumno obtiene la calificación más alta fraudulentamente. Te sientes frustrado por la injusticia pero evitaste la confrontación. Indica baja coherencia ética.'
        }
      ]
    },
    {
      id: 'scen-007',
      title: 'El uso de la IA',
      context: 'Para el ensayo final de historia, tu profesor advierte que el uso de Inteligencia Artificial para redactar el texto está prohibido. Un compañero te ofrece un software de IA indetectable.',
      difficultyLevel: 'hard',
      options: [
        {
          id: 'opt-007-a',
          code: 'A',
          text: 'Utilizar el software para ahorrar tiempo y dedicárselo a otras materias.',
          narrativeConsequence: 'Obtienes una nota excelente sin esfuerzo. Sin embargo, no aprendiste los conceptos del curso y sientes inseguridad para el examen oral. Alto riesgo cognitivo a largo plazo.'
        },
        {
          id: 'opt-007-b',
          code: 'B',
          text: 'Usar la IA como asistente de investigación para buscar fuentes, pero escribir el ensayo tú mismo.',
          narrativeConsequence: 'El ensayo es sólido, aprendiste los temas y no violaste la regla de autoría. Lograste un uso tecnológico coherente y consistente.'
        },
        {
          id: 'opt-007-c',
          code: 'C',
          text: 'Rechazar la tecnología y hacer la investigación de forma tradicional en la biblioteca.',
          narrativeConsequence: 'Te toma el doble de tiempo y tu redacción es regular, pero tu satisfacción ética es alta. Muestra alta coherencia pero baja eficiencia en la adaptación de herramientas.'
        }
      ]
    },
    {
      id: 'scen-008',
      title: 'La red social escolar',
      context: 'Un grupo de alumnos crea una red social anónima donde se publican rumores y burlas sobre profesores y compañeros. Te invitan a ser moderador del grupo.',
      difficultyLevel: 'medium',
      options: [
        {
          id: 'opt-008-a',
          code: 'A',
          text: 'Aceptar el rol de moderador para ganar popularidad entre tus compañeros.',
          narrativeConsequence: 'Te vuelves popular momentáneamente, pero la escuela descubre la página y te suspende por promover el ciberacoso. Muestra alto riesgo y nula coherencia ética.'
        },
        {
          id: 'opt-008-b',
          code: 'B',
          text: 'Rechazar la invitación y reportar la cuenta de forma anónima a la dirección del colegio.',
          narrativeConsequence: 'La escuela interviene y cierra la página salvaguardando la convivencia escolar. Tu identidad se mantiene a salvo. Coherencia y consistencia en la protección social.'
        },
        {
          id: 'opt-008-c',
          code: 'C',
          text: 'Ignorar la invitación y no decir nada a nadie.',
          narrativeConsequence: 'Los rumores continúan y terminan afectando seriamente la salud emocional de varios compañeros. Muestra baja consistencia comunitaria.'
        }
      ]
    },
    {
      id: 'scen-009',
      title: 'El proyecto de reciclaje',
      context: 'El colegio inicia un concurso de reciclaje de botellas de plástico. Tu aula va en segundo lugar, y un compañero sugiere traer botellas nuevas compradas en una distribuidora para ganar el premio.',
      difficultyLevel: 'easy',
      options: [
        {
          id: 'opt-009-a',
          code: 'A',
          text: 'Comprar las botellas para asegurar el primer lugar del concurso.',
          narrativeConsequence: 'Ganan el concurso, pero el costo de comprar las botellas fue mayor que el premio recibido. La decisión carece de coherencia ecológica y económica.'
        },
        {
          id: 'opt-009-b',
          code: 'B',
          text: 'Organizar una campaña de recolección en los parques de la comunidad el fin de semana.',
          narrativeConsequence: 'Recolectan suficientes botellas para ganar el premio legítimamente, limpiando el barrio en el proceso. Excelente coherencia de valores y alta consistencia.'
        },
        {
          id: 'opt-009-c',
          code: 'C',
          text: 'Seguir reciclando al ritmo habitual sin hacer esfuerzos adicionales.',
          narrativeConsequence: 'Quedan en segundo lugar. Aceptan el resultado de forma tranquila, pero perdieron la oportunidad de movilizar al grupo. Consistencia media.'
        }
      ]
    },
    {
      id: 'scen-010',
      title: 'El campeonato deportivo',
      context: 'El equipo de fútbol de tu aula necesita ganar el último partido para campeonar. El delantero estrella del equipo rival comete una falta leve que el árbitro no ve, pero tú puedes simular una agresión para conseguir un penal a favor.',
      difficultyLevel: 'easy',
      options: [
        {
          id: 'opt-010-a',
          code: 'A',
          text: 'Simular la agresión exagerando la caída en el área.',
          narrativeConsequence: 'El árbitro cobra penal, anotan y ganan el torneo. Sin embargo, tus compañeros rivales te recriminan y el triunfo queda manchado de sospechas. Alto riesgo moral.'
        },
        {
          id: 'opt-010-b',
          code: 'B',
          text: 'Continuar jugando limpio e intentar anotar un gol con jugadas colectivas.',
          narrativeConsequence: 'El partido termina empatado y no campeonan, pero se ganan el respeto de todo el colegio por su juego limpio. Gran coherencia de principios éticos.'
        },
        {
          id: 'opt-010-c',
          code: 'C',
          text: 'Pedir tu cambio para no tener la presión de definir el juego.',
          narrativeConsequence: 'El equipo pierde y tus compañeros se molestan por haberlos dejado en un momento clave. Muestra baja consistencia competitiva y evasión de responsabilidad.'
        }
      ]
    }
  ];

  constructor(private sessionState: SessionStateService) {}

  getNextScenario(): Observable<ScenarioResponse> {
    const currentState = this.sessionState.getState();
    const nextIndex = currentState.currentIndex + 1;

    // Pick scenario in rotation
    const scenarioIndex = (nextIndex - 1) % this.scenarios.length;
    const scenario = this.scenarios[scenarioIndex];

    // Mock UUID for sessionScenarioId
    const sessionScenarioId = `session-scen-${nextIndex}-${Math.random().toString(36).substring(2, 9)}`;

    this.sessionState.setState({
      sessionScenarioId,
      currentScenario: scenario,
      currentIndex: nextIndex
    });

    return of({
      scenario,
      sessionMeta: {
        current: nextIndex,
        totalRecommended: currentState.totalRecommended
      }
    });
  }

  getScenarioById(id: string): Observable<Scenario> {
    const scenario = this.scenarios.find(s => s.id === id) || this.scenarios[0];
    return of(scenario);
  }
}
