/**
 * Created by suat on 05-Mar-18.
 */
import {ProcessInstanceFederation} from './process-instance-federation';

export class ProcessInstanceGroup {
    constructor(public id: string = "",
                public partyID: string = "",
                public processInstances: ProcessInstanceFederation[],
                public archived: boolean = false,
                public collaborationRole: string = "",
                public associatedGroups: ProcessInstanceGroup[]) {
    }
}