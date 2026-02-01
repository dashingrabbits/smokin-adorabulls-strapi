import type { Core } from '@strapi/strapi';

export default {
  /**
   * An asynchronous register function that runs before
   * your application is initialized.
   *
   * This gives you an opportunity to extend code.
   */
  register(/* { strapi }: { strapi: Core.Strapi } */) {},

  /**
   * An asynchronous bootstrap function that runs before
   * your application gets started.
   *
   * This gives you an opportunity to set up your data model,
   * run jobs, or perform some special logic.
   */
  async bootstrap({ strapi }: { strapi: Core.Strapi }) {
    const publicRole = await strapi
      .query('plugin::users-permissions.role')
      .findOne({ where: { type: 'public' } });

    if (publicRole) {
      const permissions = await strapi
        .query('plugin::users-permissions.permission')
        .findMany({ where: { role: publicRole.id } });

      const existingActions = permissions.map((p: { action: string }) => p.action);

      const publicActions = [
        'api::puppy.puppy.find',
        'api::puppy.puppy.findOne',
        'api::stud.stud.find',
        'api::stud.stud.findOne',
        'api::testimonial.testimonial.find',
        'api::hero-slide.hero-slide.find',
        'api::site-settings.site-settings.find',
        'api::about-page.about-page.find',
      ];

      for (const action of publicActions) {
        if (!existingActions.includes(action)) {
          await strapi.query('plugin::users-permissions.permission').create({
            data: {
              action,
              role: publicRole.id,
            },
          });
        }
      }
    }

    // Seed Puppy data
    const puppyFeatureSet = [
      {
        title: 'AKC Registered',
        description: 'Registered with the American Kennel Club for pedigree verification',
      },
      {
        title: 'Health Tested Parents',
        description: 'Parents have been tested for genetic health conditions',
      },
      {
        title: 'Champion Bloodline',
        description: 'Descends from champion show dogs with excellent conformation',
      },
      {
        title: 'Microchipped',
        description: 'Includes microchip for permanent identification',
      },
      {
        title: 'Health Guarantee',
        description: '1-year health guarantee against genetic conditions',
      },
      {
        title: 'Vaccinated',
        description: 'Up-to-date on age-appropriate vaccinations',
      },
      {
        title: 'Vet Checked',
        description: 'Examined by a licensed veterinarian',
      },
      {
        title: 'Socialized',
        description: 'Well-socialized with people and other dogs',
      },
    ];

    const puppiesData: Array<{
      name: string;
      breed: string;
      age: string;
      gender: 'Female' | 'Male';
      color: string;
      price: number;
      available: boolean;
      description: string;
      tagline: string;
      features: Array<{ title: string; description: string }>;
    }> = [
      {
        name: 'Luna',
        breed: 'French Bulldog',
        age: '9 weeks',
        gender: 'Female',
        color: 'Fawn',
        price: 4500,
        available: true,
        description: 'Luna is a sweet and affectionate female French Bulldog puppy. She loves to cuddle and is great with children. AKC registered with champion bloodlines.',
        tagline: 'Playful, affectionate, and raised with care.',
        features: puppyFeatureSet,
      },
      {
        name: 'Bruno',
        breed: 'French Bulldog',
        age: '10 weeks',
        gender: 'Male',
        color: 'Brindle',
        price: 4800,
        available: true,
        description: 'Bruno is a handsome brindle male with an excellent structure and playful temperament. He comes from champion bloodlines and is AKC registered.',
        tagline: 'Confident, social, and full of personality.',
        features: puppyFeatureSet,
      },
      {
        name: 'Bella',
        breed: 'French Bulldog',
        age: '8 weeks',
        gender: 'Female',
        color: 'Blue',
        price: 5500,
        available: false,
        description: 'Bella is a gorgeous blue female Frenchie with a compact body and excellent temperament. She is well socialized and comes with health guarantees.',
        tagline: 'Gentle, sweet-natured, and ready for cuddles.',
        features: puppyFeatureSet,
      },
      {
        name: 'Max',
        breed: 'French Bulldog',
        age: '12 weeks',
        gender: 'Male',
        color: 'Pied',
        price: 5000,
        available: true,
        description: 'Max is a charming pied male Frenchie with a playful personality. He is very social, loves people, and gets along well with other pets.',
        tagline: 'Playful and curious with a big heart.',
        features: puppyFeatureSet,
      },
      {
        name: 'Rocky',
        breed: 'French Bulldog',
        age: '11 weeks',
        gender: 'Male',
        color: 'White',
        price: 4700,
        available: true,
        description: 'Rocky is a sturdy white male French Bulldog with a sweet disposition. He has been well socialized and is ready for his forever home.',
        tagline: 'Steady, loving, and eager to please.',
        features: puppyFeatureSet,
      },
      {
        name: 'Daisy',
        breed: 'French Bulldog',
        age: '9 weeks',
        gender: 'Female',
        color: 'Cream',
        price: 5200,
        available: true,
        description: 'Daisy is a beautiful cream French Bulldog puppy with a gentle, loving nature. She is great with children and other pets.',
        tagline: 'Loving, gentle, and family-ready.',
        features: puppyFeatureSet,
      },
    ];

    const existingPuppies = await strapi.documents('api::puppy.puppy').findMany({});
    if (existingPuppies.length === 0) {
      for (const puppyData of puppiesData) {
        await strapi.documents('api::puppy.puppy').create({
          data: puppyData,
          status: 'published',
        });
      }
      strapi.log.info('Seeded 6 puppies');
    }

    const allPuppies = await strapi.documents('api::puppy.puppy').findMany({});
    const featuredPuppyRefs = allPuppies
      .slice(0, 3)
      .map((puppy: { documentId?: string; id: string | number }) =>
        puppy.documentId ? { documentId: puppy.documentId } : { id: puppy.id }
      );

    // Seed Stud data
    const studsData = [
      {
        name: 'King Arthur',
        breed: 'French Bulldog',
        age: '3 years',
        color: 'Fawn with white markings',
        weight: '65 lbs',
        height: '16 inches',
        description: 'King Arthur is our premier French Bulldog stud with an exceptional temperament and classic structure. He produces puppies with excellent bone structure, broad heads, and the classic bulldog temperament.',
        achievements: [
          'AKC Champion',
          'Best of Breed (5x)',
          'Excellent health clearances',
          'OFA certified hips and elbows',
          'DNA tested clear for hereditary conditions',
        ],
      },
      {
        name: 'Duke',
        breed: 'French Bulldog',
        age: '2.5 years',
        color: 'Brindle',
        weight: '62 lbs',
        height: '15 inches',
        description: 'Duke is a handsome brindle male with a compact, muscular build and wonderful personality. He has excellent breathing and produces puppies with wide-open nostrils and great breathing ability.',
        achievements: [
          'AKC pointed',
          'Excellent structural conformation',
          'OFA health tested',
          'Clear genetic panel',
          'Proven producer of quality puppies',
        ],
      },
      {
        name: 'Bruno Mars',
        breed: 'French Bulldog',
        age: '3 years',
        color: 'Blue with tan points',
        weight: '28 lbs',
        height: '12 inches',
        description: 'Bruno Mars is our champion blue French Bulldog with an exceptional pedigree. He produces puppies with excellent structure, beautiful rare colors, and the loving Frenchie temperament.',
        achievements: [
          'AKC Grand Champion',
          'Multiple Best in Show wins',
          'DNA tested clear for IVDD',
          'OFA certified patella',
          'Cardiac clearance',
        ],
      },
      {
        name: 'Napoleon',
        breed: 'French Bulldog',
        age: '2 years',
        color: 'Cream',
        weight: '26 lbs',
        height: '11 inches',
        description: 'Napoleon is a compact, well-built cream French Bulldog with perfect bat ears and a charming personality. His puppies inherit his wonderful structure and friendly disposition.',
        achievements: [
          'AKC registered',
          'Excellent confirmation',
          'Natural breeder',
          'All health clearances',
          'Produces puppies with excellent structure',
        ],
      },
    ];

    const existingStuds = await strapi.documents('api::stud.stud').findMany({});
    if (existingStuds.length === 0) {
      for (const studData of studsData) {
        await strapi.documents('api::stud.stud').create({
          data: studData,
          status: 'published',
        });
      }
      strapi.log.info('Seeded 4 studs');
    }

    // Seed Testimonial data
    const testimonialsData = [
      {
        name: 'Jennifer L.',
        quote: 'Our bulldog from Smokin Adorabulls has been the perfect addition to our family. Healthy, beautiful, and the sweetest temperament!',
        location: 'San Diego, CA',
      },
      {
        name: 'Michael T.',
        quote: 'The entire process from selecting our puppy to bringing him home was seamless. Their knowledge and dedication to the breed is impressive.',
        location: 'Phoenix, AZ',
      },
      {
        name: 'Sarah M.',
        quote: "We've had bulldogs before, but the puppy we got from Smokin Adorabulls is exceptional in health and temperament. Couldn't be happier!",
        location: 'Austin, TX',
      },
    ];

    const existingTestimonials = await strapi.documents('api::testimonial.testimonial').findMany({});
    if (existingTestimonials.length === 0) {
      for (const testimonialData of testimonialsData) {
        await strapi.documents('api::testimonial.testimonial').create({
          data: testimonialData,
          status: 'published',
        });
      }
      strapi.log.info('Seeded 3 testimonials');
    }

    // Seed HeroSlide data
    const heroSlidesData = [
      {
        title: '',
        subtitle: '',
        order: 1,
        imageUrl: 'frenchbulldoghero.png',
      },
      {
        title: '',
        subtitle: '',
        order: 2,
        imageUrl: 'bostonterrierhero.png',
      },
      {
        title: '',
        subtitle: '',
        order: 3,
        imageUrl: 'fluffy.png',
      },
      {
        title: '',
        subtitle: '',
        order: 4,
        imageUrl: 'floodlehero.png',
      },
    ];

    const existingHeroSlides = await strapi.documents('api::hero-slide.hero-slide').findMany({});
    if (existingHeroSlides.length === 0) {
      for (const slideData of heroSlidesData) {
        const { imageUrl, ...data } = slideData;
        await strapi.documents('api::hero-slide.hero-slide').create({
          data: {
            ...data,
            // Note: Images must be uploaded manually via Strapi admin
            // The imageUrl field is stored for reference but actual media upload
            // requires file handling which is beyond bootstrap scope
          },
          status: 'published',
        });
      }
      strapi.log.info('Seeded 4 hero slides (images must be uploaded via admin)');
    }

    // Seed Site Settings data
    const existingSiteSettings = await strapi.documents('api::site-settings.site-settings').findFirst({});
    if (!existingSiteSettings) {
      await strapi.documents('api::site-settings.site-settings').create({
        data: {
          address: '123 Bulldog Lane, Puppyville, CA 90210',
          phone: '(123) 456-7890',
          email: 'info@smokinadorabulls.com',
          businessHours: {
            weekdays: {
              days: 'Monday - Friday',
              hours: '9:00 AM - 5:00 PM',
            },
            saturday: {
              days: 'Saturday',
              hours: '10:00 AM - 4:00 PM',
            },
            sunday: {
              days: 'Sunday',
              hours: 'By appointment only',
            },
          },
          mapEmbedUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d423286.2740658098!2d-118.69192118467525!3d34.020161304907774!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x80c2c75ddc27da13%3A0xe22fdf6f254608f4!2sLos%20Angeles%2C%20CA%2C%20USA!5e0!3m2!1sen!2sus!4v1634133641044!5m2!1sen!2sus',
        },
        status: 'published',
      });
      strapi.log.info('Seeded site settings');
    }

    // Seed About Page data
    const existingAboutPage = await strapi
      .documents('api::about-page.about-page')
      .findFirst({ populate: { featuredPuppies: true } });
    if (!existingAboutPage) {
      await strapi.documents('api::about-page.about-page').create({
        data: {
          title: 'About Smokin Adorabulls',
          subtitle:
            'Dedicated to raising the finest English and French Bulldogs with a focus on health, temperament, and conformation.',
          storyTitle: 'Our Story',
          storyContent:
            'Smokin Adorabulls began with a passion for the bulldog breed and a commitment to responsible breeding practices. What started as a hobby has grown into a respected kennel known for producing exceptional quality puppies with sound temperaments and excellent health.\\n\\nOur breeding program focuses on selecting only the finest quality dogs that exemplify the breed standards while working to minimize the health issues that can affect bulldogs.',
          philosophyTitle: 'Our Philosophy',
          philosophyContent:
            'We believe that bulldogs should be healthy, happy, and well-socialized. Our puppies are raised in our home with constant human interaction, ensuring they develop into well-adjusted companions with the classic bulldog temperament: affectionate, loyal, and gentle.\\n\\nAll of our breeding dogs undergo comprehensive health testing to minimize genetic health concerns. We provide lifetime support for all of our puppies and their families, because when you purchase a Smokin Adorabulls puppy, you become part of our extended family.',
          featuredPuppies:
            featuredPuppyRefs.length > 0 ? { set: featuredPuppyRefs } : undefined,
          // Images must be uploaded via Strapi admin and linked to storyImage/philosophyImage.
        },
        status: 'published',
      });
      strapi.log.info('Seeded about page');
    } else if (
      featuredPuppyRefs.length > 0 &&
      (!('featuredPuppies' in (existingAboutPage as object)) ||
        !(existingAboutPage as { featuredPuppies?: Array<unknown> }).featuredPuppies?.length)
    ) {
      await strapi.documents('api::about-page.about-page').update({
        documentId: (existingAboutPage as { documentId: string }).documentId,
        data: {
          featuredPuppies: { set: featuredPuppyRefs },
        },
        status: 'published',
      });
      strapi.log.info('Seeded featured puppies on about page');
    }
  },
};
