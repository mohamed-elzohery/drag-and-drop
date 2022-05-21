// Types

enum ProjectStatus {ACTIVE, FINISHED};
class Project{
    id: string ;
    constructor(
        public title: string,
        public description: string,
        public people: number,
        public status: ProjectStatus
    ){
        this.id = (Math.random() + Date.now()).toString();
    }
}

type Listener<T> = (items: T[]) => void;

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
        for(const listener of this.listeners){
            listener(this.projects.slice());
        }
    }
}

const projectState = ProjectState.getInstance();


abstract class Component <T extends HTMLElement, U extends HTMLElement>{
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
class ProjectList extends Component<HTMLDivElement, HTMLElement>{

    assignedProjects: Project[] = [];

    constructor(private type: 'active' | 'finished'){
        super('project-list', 'app', false, `${type}-projects`);
        this.element.id = `${this.type}-projects`;

        this.renderContent();
        this.configure();
    }

    renderProjects() {
        const projectsList = this.element.querySelector(`#${this.type}-projects-list`)! as HTMLUListElement;
        projectsList.innerHTML = '';
        for(const project of this.assignedProjects){
            const listItem = document.createElement('li');
            listItem.textContent = project.title;
            projectsList.appendChild(listItem);
        }
    }

    renderContent(){
        this.element.querySelector('ul')!.id = `${this.type}-projects-list`;
        this.element.querySelector('h2')!.textContent = this.type.toUpperCase() + ' Projects';
    }

    configure() {
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
class ProjectInput extends Component<HTMLDivElement, HTMLFormElement> {

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