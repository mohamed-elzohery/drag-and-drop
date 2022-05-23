namespace App {
    
    export abstract class Component <T extends HTMLElement, U extends HTMLElement>{
        templateElement: HTMLTemplateElement;
        hostElement: T;
        element: U;

        constructor(tempId: string, hostId: string, isAfterStart: boolean, elementId?: string){
            this.templateElement = document.getElementById(tempId)! as HTMLTemplateElement;
            this.hostElement = document.getElementById(hostId)! as T;
            this.element = this.importTemplateContent().firstElementChild as U;

            this.attachTemplateElement(isAfterStart);
        }

        private importTemplateContent(){
            const importedNode = document.importNode(this.templateElement, true);
            return importedNode.content;
        }

        private attachTemplateElement(isAfterStart: boolean){
            this.hostElement.insertAdjacentElement(isAfterStart ? 'afterbegin' : 'beforeend', this.element);
        }

        abstract renderContent(): void;
        abstract configure(): void;
    }
}