   import { Component } from "./base"; 
   import { Project } from "../models/project";
   import { autoBind } from "../decorators/autobind";
   import { DropTarget } from "../models/drag-drop";
   import { projectState } from "../state/project";
   import { ProjectItem } from "./project-item";
   import { ProjectStatus } from "../models/project";
    export class ProjectList extends Component<HTMLDivElement, HTMLElement> implements DropTarget{

        assignedProjects: Project[] = [];
    
        constructor(private type: 'active' | 'finished'){
            super('project-list', 'app', false, `${type}-projects`);
            this.element.id = `${this.type}-projects`;
    
            this.configure();
            this.renderContent();
        }
        @autoBind
        dragOverHandler(event: DragEvent): void {
            if(event.dataTransfer && event.dataTransfer.types[0] === 'text/plain'){
                console.log(event.dataTransfer!.getData('text/plain'))
                event.preventDefault();
                const list = this.element.querySelector('ul')! as HTMLUListElement;
                list.classList.add('droppable');
            }
        }
    
        @autoBind
        dropHandler(event: DragEvent): void {
            const projectID = event.dataTransfer!.getData('text/plain');
    
            projectState.moveProject(projectID, this.type === 'active' ? ProjectStatus.ACTIVE : ProjectStatus.FINISHED);
        }
    
        @autoBind
        dragLeaveHandler(event: DragEvent): void {
            const list = this.element.querySelector('ul')! as HTMLUListElement;
            
            list.classList.remove('droppable');
        }
    
        renderProjects() {
            const projectsList = this.element.querySelector(`#${this.type}-projects-list`)! as HTMLUListElement;
            projectsList.innerHTML = '';
            for(const project of this.assignedProjects){
                new ProjectItem(projectsList.id, project);
            }
        }
    
        
        
        renderContent(){
            this.element.querySelector('h2')!.textContent = this.type.toUpperCase() + ' Projects';
        }
        
        configure() {
            this.element.querySelector('ul')!.id = `${this.type}-projects-list`;
            this.element.addEventListener('dragover', this.dragOverHandler);
            this.element.addEventListener('drop', this.dropHandler);
            this.element.addEventListener('dragleave', this.dragLeaveHandler);
            projectState.addListener((projects: Project[]) => {
                const filteredProjects = projects.filter((project: Project) => {
                    if(this.type === 'active'){
                        return project.status === ProjectStatus.ACTIVE;
                    }
                    return project.status === ProjectStatus.FINISHED;
                })
                this.assignedProjects = filteredProjects;
                this.renderProjects();
            })
        }
    }