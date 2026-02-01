import type { Schema, Struct } from '@strapi/strapi';

export interface PuppyFeature extends Struct.ComponentSchema {
  collectionName: 'components_puppy_features';
  info: {
    description: 'Puppy feature highlight';
    displayName: 'Feature';
  };
  attributes: {
    description: Schema.Attribute.Text & Schema.Attribute.Required;
    title: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

declare module '@strapi/strapi' {
  export module Public {
    export interface ComponentSchemas {
      'puppy.feature': PuppyFeature;
    }
  }
}
