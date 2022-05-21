interface Validatable{
    required: boolean
}

interface StringValidtable extends Validatable{
    value: string;
    maxLength?: number;
    minLength?: number;
}

interface NumberValidtable extends Validatable{
    value: number;
    max?: number;
    min?: number;
}

function validateValue(validator: StringValidtable | NumberValidtable){
    let isValid = true;

    if(validator.required){
        isValid = isValid && validator.value.toString().length !== 0;
    }

    if('maxLength' in validator && validator.maxLength !== undefined){
        isValid = isValid && validator.value.toString().length < validator.maxLength;
    }

    if('minLength' in validator && validator.minLength !== undefined){
        isValid = isValid && validator.value.toString().length > validator.minLength;
    }
    
    if('max' in validator && validator.max !== undefined){
        isValid = isValid && validator.value < validator.max;
    }

    if('min' in validator && validator.min !== undefined){
        isValid = isValid && validator.value > validator.min;
    }
    return isValid;
}

function autoBind(_: any, _2: string, descriptor: PropertyDescriptor){
    const originalMethod = descriptor.value;
    const adjustedDescriptor: PropertyDescriptor = {
        configurable: true,
        get(){
            const fn = originalMethod.bind(this);
            return fn;
        }
    }

    return adjustedDescriptor;
}

class ProjectList{
    templateElement: HTMLTemplateElement;
    hostElement: HTMLDivElement;
    section: HTMLElement;

    constructor(private type: 'active' | 'finished'){
        this.templateElement = document.getElementById('project-list')! as HTMLTemplateElement;
        this.hostElement = document.getElementById('app')! as HTMLDivElement;
        this.section = this.importTemplateContent().firstElementChild as HTMLElement;
        this.section.id = `${this.type}-projects`;
        this.attachTemplateSection(this.section);
        this.renderContent();
    
    }

    private renderContent(){
        this.section.querySelector('ul')!.id = `${this.type}-projects-list`;
        this.section.querySelector('h2')!.textContent = this.type.toUpperCase() + ' Projects';
    }

    private importTemplateContent(){
        const importedNode = document.importNode(this.templateElement, true);
        return importedNode.content;
    }

    private attachTemplateSection(section: HTMLElement){
        this.hostElement.insertAdjacentElement('beforeend', section);
    }
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
        const userData = this.collectFormData();
        if(Array.isArray(userData)){
            const [title, desc, people] = userData;
            console.log(title, desc, people)
            this.clearAll();
        }
    }

    private collectFormData():[string, string, number] | void{
        const enteredTitle = this.titleInput.value.trim();
        const enteredDescription = this.descriptionInput.value.trim();
        const enteredPeople = +this.peopleInput.value;

        const titleValidator : StringValidtable = {
            required: true,
            value: enteredTitle,
            minLength: 3,
            maxLength: 50
        }

        const descValidator : StringValidtable = {
            required: true,
            value: enteredDescription,
            minLength: 10,
            maxLength: 100
        }

        const peopleValidator : NumberValidtable = {
            required: true,
            value: enteredPeople,
            min: 2,
            max: 6
        }

        if(this.isFormValid([titleValidator, descValidator, peopleValidator])){
            return [enteredTitle, enteredDescription, +enteredPeople];
        }

        alert("Form not valid")
    }

    private isFormValid(input: [StringValidtable, StringValidtable, NumberValidtable]): boolean{
        return input.every(validator => validateValue(validator));
    }

    private clearAll(){
        this.titleInput.value = '';
        this.descriptionInput.value = '';
        this.peopleInput.value = '';
    }
}

const projectInput = new ProjectInput();
const activeList = new ProjectList('active');
const finishedList = new ProjectList('finished');