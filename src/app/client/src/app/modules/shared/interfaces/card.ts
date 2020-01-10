export interface ICard {
    name: string;
    image?: string;
    status?: string;
    enrolledDate?: any;
    createdOn?: any;
    lastUpdatedOn?: any;
    imageVisibility?: boolean;
    description?: string;
    subject?: string;
    medium?: string;
    creator?: string;
    orgDetails?: { orgName: string, email: string};
    gradeLevel?: any;
    resourceType?: string;
    maxCount?: number;
    progress?: number;
    ribbon?: {
        right?: { class: string, name: string }
        left?: { class: string, name: string , image: string }
    };
    rating?: number;
    metaData?: any;
    artifactUrl?: string;
    previewUrl?: string;
    action?: {
        right?: {
            class: string,
            text?: string,
            eventName: string,
            displayType: string
        };
        left?: {
            class: string,
            text?: string,
            eventName: string,
            displayType: string
        };
        onImage?: {
            eventName: string
        };
    };
}
