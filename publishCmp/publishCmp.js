import { LightningElement, wire } from 'lwc';
import { fireEvent } from 'c/pubsub';
import { CurrentPageReference } from 'lightning/navigation';

export default class PublishCmp extends LightningElement {
  
    @wire(CurrentPageReference) objpageReference;
    get options() {
        return [
            { label: 'Hot', value: 'Hot' },
            { label: 'Warm', value: 'Warm' },
            { label: 'Cold', value: 'Cold' },
        ];
    }

    handleChange(event) {
        this.value = event.detail.value;
      
        fireEvent(this.objpageReference, 'RatingValue', this.value);
        }


}