import type { Project } from './projects';
import { orderedProjects } from './projects';

/** A curated, exhaustive editorial taxonomy. Classification is about what each
 * project is for, not an assertion about production readiness. */
export const domains = [
  { id:'connection', index:'01', eyebrow:'PEOPLE / EXPERIENCES', title:'Human connection', short:'Human connection', description:'Products where the primary unit is a person: connecting, coordinating, publishing, listening, collaborating, and exchanging. The interface is the beginning; meaningful interaction is the outcome.', statement:'Technology should make distance feel smaller.', accent:'#e4bba6' },
  { id:'intelligence', index:'02', eyebrow:'REASONING / EXECUTION', title:'Intelligent systems', short:'Intelligence', description:'Experimental computation, agent environments, memory and adaptive execution. Different architectures, one recurring question: how can a system take context and produce accountable action?', statement:'From an instruction to an acting system.', accent:'#c9bdf0' },
  { id:'engineering', index:'03', eyebrow:'RELIABILITY / TOOLING', title:'Developer engineering', short:'Engineering', description:'The machinery behind dependable software changes: understanding code, controlling mutations, diagnosing failures and verifying results instead of trusting appearances.', statement:'Software is only finished when it is verified.', accent:'#b5ccb5' },
  { id:'signals', index:'04', eyebrow:'DATA / UNCERTAINTY', title:'Data & markets', short:'Data & markets', description:'Systems that interpret messy information, migrate it safely, and investigate signals in uncertain environments. Evidence, provenance, limits and errors are part of the story.', statement:'A signal is not proof. Make it testable.', accent:'#e7c78b' },
  { id:'applied', index:'05', eyebrow:'REAL-WORLD PROBLEMS', title:'Applied products', short:'Applied products', description:'Domain-specific explorations in agriculture, creative media and work. These projects translate technology into workflows that can be experienced outside a research environment.', statement:'Good technology disappears into its purpose.', accent:'#b6d6cd' },
  { id:'laboratory', index:'06', eyebrow:'PROTOTYPES / ARCHIVES', title:'The laboratory', short:'Laboratory', description:'Smaller experiments, prototypes and lightly documented repositories. They stay visible with honest scope labels rather than being dressed up as complete products.', statement:'Not every experiment is a finished product.', accent:'#d6b6bd' }
] as const;

export type DomainId = typeof domains[number]['id'];

export const projectDomain: Readonly<Record<string,DomainId>> = {
 'raedius':'connection','daish':'connection','dvange':'connection','ritchs':'connection','trakiler':'connection',
 'arkhe':'intelligence','airadise':'intelligence','axiom':'intelligence','laya':'intelligence','nexus':'intelligence','dot-os':'intelligence',
 'codebase-os':'engineering','faultline':'engineering','grelon':'engineering','pact':'engineering','kata':'engineering','nishtha':'engineering',
 'spool':'signals','stanius':'signals','zachitan':'signals','jed':'signals',
 'agri-ai':'applied','agri-farm':'applied','resume-system':'applied','maleu-reel-studio':'applied',
 'line-connect-grow':'laboratory','sutle':'laboratory','noa-app':'laboratory','raw':'laboratory','nistha':'laboratory','noa':'laboratory','reume-build':'laboratory'
};

export function getDomain(project: Project): DomainId {
  return projectDomain[project.id] ?? 'laboratory';
}

export function groupedProjects(input: readonly Project[] = orderedProjects()) {
  return domains.map(domain => ({
    ...domain,
    projects: input.filter(project => project.id !== 'maleu' && getDomain(project) === domain.id)
  }));
}
