    import { ProjectStatus } from "../models/project";
    import { Project } from "../models/project";
    type Listener<T> = (items: T[]) => void;

    class State<T> {
        protected listeners: Listener<T>[] = [];

        addListener(listener: Listener<T>){
            this.listeners.push(listener);
        }

    }

    
    class ProjectState extends State<Project>{
        projects: Project[] = [];
        private static instance: ProjectState;
        private constructor (){
            super();
        }
        static getInstance(){
            if(this.instance){
                return this.instance
            }
            this.instance = new ProjectState();
            return this.instance
        }

        
        addProject(title: string, desc: string, people: number){
            const newProject = new Project(title, desc, people, ProjectStatus.ACTIVE);
            this.projects.push(newProject);
            this.updateListeners();
        }

        updateListeners(){
            for(const listener of this.listeners){
                listener(this.projects.slice());
            }
        }

        moveProject(projectID: string, newStatus: ProjectStatus){
            const project = this.projects.filter((proj:Project) => proj.id === projectID)[0];
            if(project && project.status !== newStatus){
                project.status = newStatus;
                this.updateListeners();
            }
        }
    }

    export const projectState = ProjectState.getInstance();