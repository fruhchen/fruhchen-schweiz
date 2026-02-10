'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Icon } from '@/components/ui/icon';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar } from '@/components/ui/avatar';
import { ProgressBar } from '@/components/ui/progress-bar';
import { PageHeader } from '@/components/layout/page-header';
import { Modal } from '@/components/ui/modal';

type ProjectStatus = 'active' | 'planning' | 'completed' | 'paused';

interface Project {
  id: string;
  name: string;
  status: ProjectStatus;
  progress: number;
  lead: string;
  team: string[];
  deadline: string;
  tasks: { total: number; done: number };
  description: string;
}

const PROJECTS: Project[] = [
  {
    id: '1',
    name: 'App-Entwicklung Frühchen Schweiz',
    status: 'active',
    progress: 35,
    lead: 'Dina Hediger',
    team: ['Dina Hediger', 'Mario Bühler', 'Codazure'],
    deadline: '2026-12-31',
    tasks: { total: 48, done: 17 },
    description: 'Entwicklung der digitalen Plattform für Familien und Admin-Team.',
  },
  {
    id: '2',
    name: 'Weltfrühgeborenentag 2026',
    status: 'planning',
    progress: 15,
    lead: 'Sandra Meier',
    team: ['Sandra Meier', 'Désirée Koch', 'Nadine Vogt'],
    deadline: '2026-11-17',
    tasks: { total: 32, done: 5 },
    description: 'Organisation des nationalen Events zum Weltfrühgeborenentag.',
  },
  {
    id: '3',
    name: 'Peer-Ausbildung Zürich',
    status: 'active',
    progress: 60,
    lead: 'Sandra Meier',
    team: ['Sandra Meier', 'Claudia Weber'],
    deadline: '2026-06-30',
    tasks: { total: 18, done: 11 },
    description: 'Aufbau einer neuen Peer-Gruppe in der Region Zürich.',
  },
  {
    id: '4',
    name: 'Jahresbericht 2025',
    status: 'active',
    progress: 75,
    lead: 'Désirée Koch',
    team: ['Désirée Koch', 'Dina Hediger'],
    deadline: '2026-03-31',
    tasks: { total: 12, done: 9 },
    description: 'Erstellung des Jahresberichts für Stiftungen und Gönner.',
  },
  {
    id: '5',
    name: 'Trust.ai Pilotprojekt',
    status: 'paused',
    progress: 20,
    lead: 'Dina Hediger',
    team: ['Dina Hediger'],
    deadline: '2026-09-30',
    tasks: { total: 15, done: 3 },
    description: 'Pilotierung der Arztgespräch-Aufzeichnung mit Trust.ai.',
  },
];

const statusConfig: Record<ProjectStatus, { label: string; color: string }> = {
  active: { label: 'Aktiv', color: 'green' },
  planning: { label: 'Planung', color: 'blue' },
  completed: { label: 'Abgeschlossen', color: 'gray' },
  paused: { label: 'Pausiert', color: 'yellow' },
};

export default function ProjectsPage() {
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  const filtered = statusFilter === 'all' ? PROJECTS : PROJECTS.filter((p) => p.status === statusFilter);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Projekte"
        subtitle="Aufgaben und Fortschritt für alle Projekte"
        action={<Button variant="primary" size="sm" icon="Plus">Neues Projekt</Button>}
      />

      {/* Status filter */}
      <div className="flex gap-2">
        {['all', 'active', 'planning', 'paused', 'completed'].map((s) => (
          <button
            key={s}
            onClick={() => setStatusFilter(s)}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
              statusFilter === s ? 'bg-brand-500 text-white' : 'bg-white text-gray-600 border border-gray-200'
            }`}
          >
            {s === 'all' ? 'Alle' : statusConfig[s as ProjectStatus].label}
          </button>
        ))}
      </div>

      {/* Project cards */}
      <div className="space-y-4">
        {filtered.map((project, i) => (
          <motion.div
            key={project.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 * i }}
          >
            <Card interactive className="space-y-4 cursor-pointer" onClick={() => setSelectedProject(project)}>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold text-gray-900">{project.name}</h3>
                    <Badge variant={statusConfig[project.status].color as any}>
                      {statusConfig[project.status].label}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-500">{project.description}</p>
                </div>
              </div>

              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-500">Fortschritt</span>
                <span className="text-gray-700 font-medium">{project.tasks.done}/{project.tasks.total} Aufgaben</span>
              </div>
              <ProgressBar
                value={project.progress}
                color={project.progress >= 75 ? 'green' : project.progress >= 50 ? 'brand' : 'violet'}
                showLabel
              />

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-400">Team:</span>
                  <div className="flex -space-x-2">
                    {project.team.slice(0, 3).map((member) => (
                      <Avatar key={member} name={member} size="sm" className="ring-2 ring-white" />
                    ))}
                    {project.team.length > 3 && (
                      <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-xs text-gray-600 ring-2 ring-white">
                        +{project.team.length - 3}
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-1 text-xs text-gray-400">
                  <Icon name="Calendar" size={12} />
                  <span>
                    Deadline: {new Date(project.deadline).toLocaleDateString('de-CH', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </span>
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Project detail modal */}
      <Modal open={!!selectedProject} onClose={() => setSelectedProject(null)} title={selectedProject?.name || ''} size="lg">
        {selectedProject && (
          <div className="space-y-6">
            <div className="flex flex-wrap items-center gap-3">
              <Badge variant={statusConfig[selectedProject.status].color as any}>
                {statusConfig[selectedProject.status].label}
              </Badge>
              <span className="text-sm text-gray-500">
                Deadline: {new Date(selectedProject.deadline).toLocaleDateString('de-CH', { day: 'numeric', month: 'long', year: 'numeric' })}
              </span>
            </div>

            <p className="text-sm text-gray-700 leading-relaxed">{selectedProject.description}</p>

            <div>
              <div className="flex items-center justify-between text-sm mb-2">
                <span className="text-gray-500">Fortschritt</span>
                <span className="text-gray-700 font-medium">{selectedProject.tasks.done}/{selectedProject.tasks.total} Aufgaben</span>
              </div>
              <ProgressBar
                value={selectedProject.progress}
                color={selectedProject.progress >= 75 ? 'green' : selectedProject.progress >= 50 ? 'brand' : 'violet'}
                showLabel
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <p className="text-xs font-medium text-gray-400 uppercase tracking-wider">Projektleitung</p>
                <div className="flex items-center gap-2">
                  <Avatar name={selectedProject.lead} size="sm" />
                  <p className="text-sm text-gray-900">{selectedProject.lead}</p>
                </div>
              </div>
              <div className="space-y-1">
                <p className="text-xs font-medium text-gray-400 uppercase tracking-wider">Status</p>
                <p className="text-sm text-gray-900">{statusConfig[selectedProject.status].label}</p>
              </div>
            </div>

            <div className="space-y-2">
              <p className="text-xs font-medium text-gray-400 uppercase tracking-wider">Team</p>
              <div className="flex flex-wrap gap-2">
                {selectedProject.team.map((member) => (
                  <div key={member} className="flex items-center gap-2 bg-gray-50 rounded-xl px-3 py-2">
                    <Avatar name={member} size="sm" />
                    <span className="text-sm text-gray-700">{member}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
