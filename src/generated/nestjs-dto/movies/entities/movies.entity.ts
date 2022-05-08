
import {Appliers} from '../../appliers/entities/appliers.entity'


export class Movies {
  id: string ;
title: string ;
released: string ;
genre: string ;
director: string ;
applier?: Appliers[] ;
}
