import { Component } from "./base";
import { Project } from "../models/project";
import { autoBind } from "../decorators/autobind";
import { Draggable } from "../models/drag-drop";
    export class ProjectItem extends Component<HTMLUListElement, HTMLLIElement> implements Draggable{

        get persons(){
            if(this.project.people === 1) return '1 person';
            return `${this.project.people} persons`
        }
    
        constructor(hostId: string,private project:Project){
            super('single-project', hostId, false, project.id);
    
            this.configure();
            this.renderContent();
        }
    
        @autoBind
        dragStartHandler(event: DragEvent): void {
            event.dataTransfer!.setData('text/plain', this.project.id);
            event.dataTransfer!.effectAllowed = "move";
        }
    
        @autoBind
        dragEndHandler(event: DragEvent): void {
        }
    
        renderContent(): void {
            this.element.querySelector('h2')!.textContent = this.project.title;
            this.element.querySelector('h3')!.textContent = this.persons + ' assgined';
            this.element.querySelector('p')!.textContent = this.project.description;
        }
    
        configure():void {
            this.element.addEventListener('dragstart', this.dragStartHandler);
            this.element.addEventListener('dragend', this.dragEndHandler);
        };
    }