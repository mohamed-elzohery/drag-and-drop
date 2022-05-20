

function autoBind(_: any, _2: string, descriptor: PropertyDescriptor){
    console.log(descriptor.value);
    const originalMethod = descriptor.value;
    const adjustedDescriptor: PropertyDescriptor = {
        configurable: true,
        get(){
            const fn = originalMethod.bind(this);
            return fn;
        }
    }

    console.log(adjustedDescriptor)
    return adjustedDescriptor;
}
class ProjectInput {
    templateElement: HTMLTemplateElement;
    hostElement: HTMLDivElement;

    formElement: HTMLFormElement;

    titleInput: HTMLInputElement;
    descriptionInput: HTMLInputElement;
    peopleInput: HTMLInputElement;

    constructor(){
        this.templateElement = document.getElementById('project-input')! as HTMLTemplateElement;
        this.hostElement = document.getElementById('app')! as HTMLDivElement;
        this.formElement = this.importTemplateContent().firstElementChild as HTMLFormElement;
        this.attachTemplateForm(this.formElement);

        this.titleInput = this.formElement.querySelector('#title')! as HTMLInputElement;
        this.descriptionInput = this.formElement.querySelector('#description')! as HTMLInputElement;
        this.peopleInput = this.formElement.querySelector('#people')! as HTMLInputElement;

        this.configureForm()
    }

    private importTemplateContent(){
        const importedNode = document.importNode(this.templateElement, true);
        return importedNode.content;
    }

    private attachTemplateForm(form: HTMLFormElement){
        this.hostElement.insertAdjacentElement('afterbegin', form);
    }

    private configureForm(){
        this.formElement.addEventListener("submit", this.sumbitHandler);
    }

    @autoBind
    private sumbitHandler(event: Event){
        event.preventDefault();
        console.log(this.titleInput.value);
    }
}

const projectInput = new ProjectInput();