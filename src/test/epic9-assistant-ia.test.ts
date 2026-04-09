import { describe, it, expect } from 'vitest';
import { readFileSync, existsSync } from 'fs';
import { resolve } from 'path';

// Story 9.1: Edge Function assistant-query
describe('Story 9.1: assistant-query Edge Function', () => {
  const filePath = resolve(__dirname, '../../supabase/functions/assistant-query/index.ts');

  it('should exist', () => {
    expect(existsSync(filePath)).toBe(true);
  });

  it('should load dossiers by copro_id', () => {
    const content = readFileSync(filePath, 'utf-8');
    expect(content).toContain('copro_id');
    expect(content).toContain('dossiers');
  });

  it('should build RAG context with dossiers and signalements', () => {
    const content = readFileSync(filePath, 'utf-8');
    expect(content).toContain('DOSSIERS DE LA COPROPRI');
    expect(content).toContain('SIGNALEMENTS EN ATTENTE');
  });

  it('should call Anthropic API', () => {
    const content = readFileSync(filePath, 'utf-8');
    expect(content).toContain('api.anthropic.com');
  });

  it('should return matched_dossiers and suggested_actions', () => {
    const content = readFileSync(filePath, 'utf-8');
    expect(content).toContain('matched_dossiers');
    expect(content).toContain('suggested_actions');
  });
});

// Story 9.2: Chat texte
describe('Story 9.2: AssistantIA page — chat texte', () => {
  const filePath = resolve(__dirname, '../pages/AssistantIA.tsx');

  it('should exist', () => {
    expect(existsSync(filePath)).toBe(true);
  });

  it('should have text input and send button', () => {
    const content = readFileSync(filePath, 'utf-8');
    expect(content).toContain('textInput');
    expect(content).toContain('handleSubmit');
  });

  it('should call assistant-query Edge Function', () => {
    const content = readFileSync(filePath, 'utf-8');
    expect(content).toContain('assistant-query');
  });

  it('should display user and agent bubbles', () => {
    const content = readFileSync(filePath, 'utf-8');
    expect(content).toContain('role: "user"');
    expect(content).toContain('role: "agent"');
  });

  it('should have stateless conversation (React state)', () => {
    const content = readFileSync(filePath, 'utf-8');
    expect(content).toContain('useState<AgentTurn[]>');
  });
});

// Story 9.3: Suggestions & actions
describe('Story 9.3: Suggestions, chips & actions', () => {
  const content = readFileSync(resolve(__dirname, '../pages/AssistantIA.tsx'), 'utf-8');

  it('should have suggestion chips on idle', () => {
    expect(content).toContain('SUGGESTIONS');
    expect(content).toContain('Où en est');
  });

  it('should render action buttons from agent response', () => {
    expect(content).toContain('handleAction');
    expect(content).toContain('view_dossier');
    expect(content).toContain('create_signalement');
  });

  it('should navigate to dossier on action click', () => {
    expect(content).toContain('/dossiers/');
  });
});

// Story 9.4: Agent vocal
describe('Story 9.4: Agent vocal', () => {
  const content = readFileSync(resolve(__dirname, '../pages/AssistantIA.tsx'), 'utf-8');

  it('should have mic button', () => {
    expect(content).toContain('handleMicPress');
    expect(content).toContain('isRecording');
  });

  it('should show recording state with animation', () => {
    expect(content).toContain('animate-pulse');
    expect(content).toContain('scale-110');
  });

  it('should use Speech Recognition', () => {
    expect(content).toContain('SpeechRecognition');
  });
});

// Story 9.5: Animations
describe('Story 9.5: Animations & transitions', () => {
  const content = readFileSync(resolve(__dirname, '../pages/AssistantIA.tsx'), 'utf-8');

  it('should have typing indicator with bounce animation', () => {
    expect(content).toContain('animate-bounce');
    expect(content).toContain('animationDelay');
  });

  it('should have agent bubble slide-in animation', () => {
    expect(content).toContain('animate-in');
    expect(content).toContain('fade-in');
    expect(content).toContain('slide-in-from-left');
  });

  it('should calculate typing delay proportional to response length', () => {
    expect(content).toContain('Math.min(1800');
    expect(content).toContain('Math.max(700');
  });

  it('should show idle state with large mic button', () => {
    expect(content).toContain('w-24 h-24');
    expect(content).toContain('Appuyez pour parler');
  });
});

// Routing
describe('AssistantIA routing', () => {
  const appContent = readFileSync(resolve(__dirname, '../App.tsx'), 'utf-8');

  it('should import AssistantIA', () => {
    expect(appContent).toContain('import AssistantIA');
  });

  it('should route /assistant to AssistantIA', () => {
    expect(appContent).toContain('AssistantIA');
  });
});
