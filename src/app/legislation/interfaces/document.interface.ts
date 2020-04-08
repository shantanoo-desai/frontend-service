/*
 * Copyright 2020
 * AIDIMME - Technological Institute of Metalworking, Furniture, Wood, Packaging and Related sectors; Valencia; Spain
   In collaboration with
 * SRFG - Salzburg Research Forschungsgesellschaft mbH; Salzburg; Austria
   Licensed under the Apache License, Version 2.0 (the "License");
   you may not use this file except in compliance with the License.
   You may obtain a copy of the License at
       http://www.apache.org/licenses/LICENSE-2.0
   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
 */

export interface DocumentInterface {
    mainAttr?: MainAttrInterface;
    specAttr?: SpecAttrInterface;
}

export interface MainAttrInterface {
    documentId?: string,
    documentType?: string;

    dateEntry?: string;

    code?: string;
    title?: string;
    description?: string;
}

export interface SpecAttrInterface {
    regulationType?: string;
    regulationNumber?: string;
    technicalCommittee?: string;
    editingDate?: string;
    numOfPages?: string;
    language?: string;
    identifyEN?: string;

    legalAssessment?: string;
    link?: string;
    country?: string;
    publicationDate?: string;
    documentOrigin?: string;

    authors?: string;
    dateOfDocument?: string;

    patentCode?: string;
    descriptors?: string;
}
