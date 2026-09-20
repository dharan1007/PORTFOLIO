import type { CSSProperties } from 'react';
import type { Project } from '../data/projects';

type VisualMode = 'flow' | 'storyboard' | 'orbit' | 'pipeline' | 'timeline' | 'stackmap' | 'loop' | 'constellation' | 'decision' | 'swimlane' | 'radial' | 'ladder' | 'network' | 'sequence' | 'funnel' | 'layers';

const modes: VisualMode[] = ['flow','storyboard','orbit','pipeline','timeline','stackmap','loop','constellation','decision','swimlane','radial','ladder','network','sequence','funnel','layers'];

const customSteps: Record<string, string[]> = {
  raedius: ['Capture a Line, Plane or Dot', 'Apply Request / Unlock / Offer intent', 'Resolve audience or smart matching', 'Exchange, respond and preserve outcome'],
  airadise: ['Observe local user + device context', 'Retrieve durable memory and capabilities', 'Plan an action under permission boundaries', 'Execute, verify and persist evidence'],
  arkhe: ['Load runtime state and objective', 'Generate competing reasoning paths', 'Execute tools / code in bounded environments', 'Verify result, recover and learn from failure'],
  'codebase-os': ['Index the repository as a system', 'Build architectural and dependency context', 'Plan changes against explicit contracts', 'Verify impact before accepting mutation'],
  spool: ['Snapshot the source deterministically', 'Chunk + identify source material', 'Execute resumable migration', 'Verify destination and produce evidence'],
  faultline: ['Capture browser state and symptoms', 'Locate the fault boundary', 'Reproduce the failure with evidence', 'Validate the repair against the same path'],
  laya: ['Collect personal context', 'Retrieve relevant memory', 'Plan assistance around current intent', 'Return or execute a bounded action'],
  daish: ['Open transient venue access', 'Collect music intent / request', 'Match energy, beat and queue state', 'Mix playback with announcements'],
  grelon: ['Ingest developer context', 'Construct the working system model', 'Coordinate changes and checks', 'Return an auditable developer outcome'],
  'maleu-reel-studio': ['Start from a media brief', 'Generate visual / sequence material', 'Assemble reel structure', 'Export the resulting media artifact'],
  nexus: ['Normalize a workload', 'Map it onto execution primitives', 'Adapt computation as state changes', 'Expose the resulting system output'],
  'dot-os': ['Observe operating context', 'Allocate adaptive intelligence', 'Coordinate system capabilities', 'Continuously refine execution state'],
  zachitan: ['Acquire provider-backed market data', 'Normalize chronology + provenance', 'Model and validate candidate forecasts', 'Surface uncertainty with research evidence'],
  pact: ['Adapt intent into a command', 'Apply policy + approval gates', 'Coordinate external mutation', 'Verify and issue a receipt'],
  kata: ['Define a research question or benchmark', 'Run the evaluated agent / system', 'Capture trace and evidence', 'Compare results against the contract'],
  stanius: ['Ingest market observations', 'Build chronological features', 'Estimate candidate signals', 'Validate against held-out history'],
  trakiler: ['Capture a training state', 'Structure the movement / session', 'Track feedback and progression', 'Return an actionable fitness view'],
  'agri-ai': ['Capture agricultural inputs', 'Apply the AI decision layer', 'Generate field-level guidance', 'Present the result to the operator'],
  'agri-farm': ['Collect farm context', 'Organize operational records', 'Apply domain logic', 'Expose the farm workflow'],
  dvange: ['Collect life / social context', 'Route intent into the experience layer', 'Coordinate product modules', 'Return a unified user experience'],
  jed: ['Collect energy telemetry', 'Model load / usage behaviour', 'Detect or predict meaningful state', 'Expose an actionable energy signal'],
  maleu: ['Create social content', 'Classify format and audience', 'Distribute through social graph', 'Collect reactions and continuation'],
  ritchs: ['Create a marketplace intent', 'Match supply and demand', 'Coordinate transaction state', 'Surface resulting exchange'],
  'resume-system': ['Parse role and candidate context', 'Map evidence to requirements', 'Optimize structure and keywords', 'Produce a role-specific application artifact'],
  nishtha: ['Inspect damaged repository metadata', 'Recover reachable project state', 'Reconstruct expected structure', 'Verify repository usability'],
  nistha: ['Inspect repository snapshot', 'Identify available structure', 'Preserve recoverable state', 'Document unresolved gaps'],
  'line-connect-grow': ['Load application scaffold', 'Connect core page flows', 'Apply presentation components', 'Deliver the web surface'],
  sutle: ['Initialize mobile scaffold', 'Compose screens and navigation', 'Connect application state', 'Package the mobile experience'],
  'noa-app': ['Initialize mobile product shell', 'Compose interface flows', 'Connect local / remote state', 'Deliver the application surface'],
  noa: ['Inspect repository snapshot', 'Identify available modules', 'Preserve current state', 'Document what remains unknown'],
  raw: ['Capture repository snapshot', 'Expose existing material', 'Preserve evidence', 'Avoid unsupported interpretation'],
  'reume-build': ['Load repository snapshot', 'Inspect available resume tooling', 'Preserve implemented pieces', 'Document unresolved intent']
};

function fallbackSteps(project: Project) {
  const stack = project.stack.slice(0, 2);
  return [
    'Capture ' + project.category.toLowerCase() + ' input',
    stack[0] ? 'Process through ' + stack[0] : 'Normalize the working context',
    stack[1] ? 'Coordinate with ' + stack[1] : 'Execute the core system contract',
    'Return a verifiable ' + project.category.toLowerCase() + ' outcome'
  ];
}

function visualMode(project: Project): VisualMode {
  let hash = 0;
  for (const char of project.id) hash = (hash * 31 + char.charCodeAt(0)) >>> 0;
  return modes[hash % modes.length];
}

export function ProjectStory({ project }: { project: Project }) {
  const steps = customSteps[project.id] ?? fallbackSteps(project);
  const mode = visualMode(project);

  return (
    <div className={'project-story project-story-' + mode} style={{ '--accent': project.accent } as CSSProperties} data-visual-mode={mode}>
      <div className="story-head">
        <span className="mono">{mode.replace('stackmap','stack map')}</span>
        <strong>{project.name} / SYSTEM MAP</strong>
      </div>
      <div className="story-canvas">
        {steps.map((step, index) => (
          <article className="story-node" key={step} style={{ '--i': index } as CSSProperties}>
            <span>{String(index + 1).padStart(2, '0')}</span>
            <p>{step}</p>
          </article>
        ))}
        <svg className="story-lines" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
          <path d="M9 52 C24 10, 39 90, 52 48 S78 12, 92 51" />
          <path d="M9 52 C30 63, 58 32, 92 51" />
        </svg>
      </div>
      <div className="story-foot">
        <span>{project.category}</span>
        <span>{project.status}</span>
      </div>
    </div>
  );
}
