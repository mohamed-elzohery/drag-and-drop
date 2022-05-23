
import { Component } from "./base.js";
import { autoBind } from "../decorators/autobind.js";
import { StringValidtable, NumberValidtable, validateValue } from "../utils/validation.js";
import { projectState } from "../state/project.js";
    export class ProjectInput extends Component<HTMLDivElement, HTMLFormElement> {

        titleInput: HTMLInputElement;
        descriptionInput: HTMLInputElement;
        peopleInput: HTMLInputElement;
    
        constructor(){
            super('project-input', 'app', true);
    
            this.titleInput = this.element.querySelector('#title')! as HTMLInputElement;
            this.descriptionInput = this.element.querySelector('#description')! as HTMLInputElement;
            this.peopleInput = this.element.querySelector('#people')! as HTMLInputElement;
    
            this.configure()
        }
    
    
        configure(){
            this.element.addEventListener("submit", this.sumbitHandler);
        }
    
        @autoBind
        private sumbitHandler(event: Event){
            event.preventDefault();
            const userData = this.validateFormData();
            if(Array.isArray(userData)){
                const [title, desc, people] = userData;
                projectState.addProject(title, desc, people);
                this.clearAll();
            }
        }
    
        renderContent(){}
    
        private validateFormData():[string, string, number] | void{
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