class ProjectInput {
    templateElement: HTMLTemplateElement;
    hostElement: HTMLDivElement;

    constructor(){
        this.templateElement = document.getElementById('project-input')! as HTMLTemplateElement;
        this.hostElement = document.getElementById('app')! as HTMLDivElement;

        this.attachTemplateForm();
    }

    private importTemplateContent(){
        const importedNode = document.importNode(this.templateElement, true);
        return importedNode.content;
    }

    private attachTemplateForm(){
        const templateForm = this.importTemplateContent().firstElementChild as HTMLFormElement;
        this.hostElement.insertAdjacentElement('afterbegin', templateForm);
    }
}

const iiii = new ProjectInput();