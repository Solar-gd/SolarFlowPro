
import React, { useState } from 'react';
import { Project, ProjectStatus, User, UserRole } from './types';
import Dashboard from './components/Dashboard';
import ProjectList from './components/ProjectList';
import ProjectDetails from './components/ProjectDetails';
import Login from './components/Login';

const MOCK_PROJECTS: Project[] = [
  {
    id: '1',
    clientName: 'João Silva',
    address: 'Rua das Flores, 123 - Campinas, SP',
    status: ProjectStatus.VISTORIA,
    powerKwp: 4.5,
    estimatedProduction: 550,
    startDate: '2023-10-15',
    notes: 'Cliente quer o inversor na garagem.'
  },
  {
    id: '2',
    clientName: 'Fazenda Santa Maria',
    address: 'Estrada Rural KM 12 - Piracicaba, SP',
    status: ProjectStatus.AGUARDANDO_ANALISE,
    powerKwp: 75.0,
    estimatedProduction: 9200,
    startDate: '2023-09-20',
    notes: 'Vistoria realizada ontem por campo.'
  },
  {
    id: '3',
    clientName: 'Padaria do Sol',
    address: 'Av. Brasil, 500 - Americana, SP',
    status: ProjectStatus.INSTALACAO,
    powerKwp: 12.0,
    estimatedProduction: 1450,
    startDate: '2023-10-01',
    notes: 'Requer reforço estrutural no telhado.'
  }
];

const App: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [view, setView] = useState<'dashboard' | 'projects'>('dashboard');
  const [projects, setProjects] = useState<Project[]>(MOCK_PROJECTS);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  if (!currentUser) {
    return <Login onLogin={setCurrentUser} />;
  }

  const isEngenharia = currentUser.role === UserRole.ENGENHARIA;

  const handleUpdateProject = (updated: Project) => {
    setProjects(prev => prev.map(p => p.id === updated.id ? updated : p));
    setSelectedProject(updated);
  };

  const addNewProject = () => {
    const newProject: Project = {
      id: Math.random().toString(36).substr(2, 9),
      clientName: 'Novo Cliente Solar',
      address: 'Endereço a definir',
      status: ProjectStatus.VISTORIA,
      powerKwp: 0,
      estimatedProduction: 0,
      startDate: new Date().toISOString().split('T')[0],
      notes: ''
    };
    setProjects([newProject, ...projects]);
    setSelectedProject(newProject);
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setView('dashboard');
  };

  return (
    <div className="min-h-screen flex bg-slate-50">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-900 text-white flex flex-col fixed h-full z-20">
        <div className="p-8">
          <div className="flex items-center gap-3 mb-12">
            <div className="w-10 h-10 bg-amber-400 rounded-xl flex items-center justify-center text-slate-900 shadow-lg shadow-amber-400/20">
              <i className="fas fa-sun text-xl"></i>
            </div>
            <span className="text-xl font-bold tracking-tight">SolarFlow<span className="text-amber-400">Pro</span></span>
          </div>

          <nav className="space-y-2">
            {isEngenharia && (
              <SidebarLink 
                active={view === 'dashboard'} 
                onClick={() => setView('dashboard')} 
                icon="fa-columns" 
                label="Dashboard" 
              />
            )}
            <SidebarLink 
              active={view === 'projects' || !isEngenharia} 
              onClick={() => setView('projects')} 
              icon="fa-layer-group" 
              label="Projetos" 
            />
            <SidebarLink icon="fa-calendar-alt" label="Minha Agenda" />
            {isEngenharia && <SidebarLink icon="fa-users" label="Clientes" />}
          </nav>
        </div>

        <div className="mt-auto p-6 border-t border-slate-800">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img src={currentUser.avatar} className="w-10 h-10 rounded-full ring-2 ring-slate-700" alt="Avatar" />
              <div className="overflow-hidden">
                <p className="text-sm font-bold truncate">{currentUser.name}</p>
                <p className="text-xs text-slate-400">{currentUser.role}</p>
              </div>
            </div>
            <button onClick={handleLogout} className="text-slate-500 hover:text-red-400 transition">
              <i className="fas fa-sign-out-alt"></i>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 ml-64 p-8">
        <header className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">
              {view === 'dashboard' && isEngenharia ? 'Overview do Sistema' : 'Gerenciamento de Projetos'}
            </h1>
            <p className="text-slate-500 mt-1">
              Olá, {currentUser.name}. {isEngenharia ? 'Existem 2 projetos aguardando sua análise.' : 'Seus projetos atribuídos estão listados abaixo.'}
            </p>
          </div>
          
          {isEngenharia && (
            <button 
              onClick={addNewProject}
              className="bg-amber-400 hover:bg-amber-500 text-slate-900 px-6 py-3 rounded-xl font-bold shadow-lg shadow-amber-400/20 transition flex items-center gap-2"
            >
              <i className="fas fa-plus"></i>
              Criar Projeto
            </button>
          )}
        </header>

        {(view === 'dashboard' && isEngenharia) ? (
          <Dashboard projects={projects} />
        ) : (
          <ProjectList 
            projects={projects} 
            onSelectProject={setSelectedProject} 
          />
        )}

        {selectedProject && (
          <ProjectDetails 
            project={selectedProject} 
            currentUser={currentUser}
            onUpdate={handleUpdateProject} 
            onClose={() => setSelectedProject(null)} 
          />
        )}
      </main>
    </div>
  );
};

const SidebarLink = ({ active, onClick, icon, label }: { active?: boolean; onClick?: () => void; icon: string; label: string }) => (
  <button 
    onClick={onClick}
    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
      active ? 'bg-amber-400 text-slate-900 font-bold shadow-md shadow-amber-400/10' : 'text-slate-400 hover:bg-slate-800 hover:text-white'
    }`}
  >
    <i className={`fas ${icon} w-5`}></i>
    <span>{label}</span>
  </button>
);

export default App;
