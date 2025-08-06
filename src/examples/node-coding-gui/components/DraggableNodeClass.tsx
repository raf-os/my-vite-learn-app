// experimental

export class DraggableNodeClass {
    uniqueID: string = "%ERROR%";
    RenderElement: React.ReactElement;

    constructor(element: React.ReactElement){
        this.RenderElement = element;
    }

    render(){
        return this.RenderElement;
    }
}