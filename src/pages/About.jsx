import { useInView } from 'react-intersection-observer';
import { motion } from 'framer-motion';
import PageTransition from '../components/ui/PageTransition';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/blur.css';

const About = () => {
  const [storyRef, storyInView] = useInView({ triggerOnce: true });
  const [processRef, processInView] = useInView({ triggerOnce: true });
  const [valuesRef, valuesInView] = useInView({ triggerOnce: true });

  return (
    <PageTransition>
      {/* Hero Section */}
      <section className="relative h-[60vh] flex items-center">
        <div className="absolute inset-0">
          <LazyLoadImage
            src="https://images.unsplash.com/photo-1565193229798-c5f891ace8bf"
            alt="Pottery Workshop"
            effect="blur"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black bg-opacity-40" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white">
          <h1 className="text-4xl md:text-5xl font-serif mb-4">Our Story</h1>
          <p className="text-xl max-w-2xl mx-auto">
            Crafting beauty from earth, one piece at a time
          </p>
        </div>
      </section>

      {/* Our Story */}
      <section
        ref={storyRef}
        className="py-24 bg-clay-50"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={storyInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center"
          >
            <div>
              <h2 className="text-3xl font-serif text-clay-800 mb-6">
                Crafting Dreams Since 2020
              </h2>
              <div className="prose prose-lg">
                <p>
                  ClayAura began as a small pottery studio in a quiet corner of our home. 
                  What started as a passionate hobby soon blossomed into something more meaningful 
                  - a dedication to creating pieces that bring both beauty and function to everyday life.
                </p>
                <p>
                  Our founder, Sarah Mitchell, discovered her love for ceramics during a 
                  transformative trip to Japan, where she was deeply moved by the philosophy 
                  of finding beauty in imperfection and the deep connection between artisan and material.
                </p>
              </div>
            </div>
            <div className="relative h-96">
              <LazyLoadImage
                src="https://images.unsplash.com/photo-1493106641515-6b5631de4bb9"
                alt="Pottery Making"
                effect="blur"
                className="absolute inset-0 w-full h-full object-cover rounded-lg"
              />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Our Process */}
      <section
        ref={processRef}
        className="py-24 bg-white"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={processInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl font-serif text-clay-800 mb-4">
              Our Process
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Every piece tells a story of careful craftsmanship and attention to detail
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: "Hand-Thrown",
                description: "Each piece begins its journey on the potter's wheel, shaped by experienced hands.",
                image: "https://images.unsplash.com/photo-1565193229798-c5f891ace8bf",
              },
              {
                title: "Slow-Dried",
                description: "Pieces are carefully dried to prevent warping and ensure structural integrity.",
                image: "https://images.unsplash.com/photo-1493106641515-6b5631de4bb9",
              },
              {
                title: "Twice-Fired",
                description: "Two firing processes and our signature glazes create unique, durable pieces.",
                image: "https://images.unsplash.com/photo-1565193229798-c5f891ace8bf",
              },
            ].map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={processInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                className="bg-clay-50 rounded-lg overflow-hidden"
              >
                <div className="h-48 relative">
                  <LazyLoadImage
                    src={step.image}
                    alt={step.title}
                    effect="blur"
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-medium text-clay-800 mb-2">
                    {step.title}
                  </h3>
                  <p className="text-gray-600">{step.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Our Values */}
      <section
        ref={valuesRef}
        className="py-24 bg-earth-100"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={valuesInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl font-serif text-clay-800 mb-4">
              Our Values
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              The principles that guide our craft and business
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                title: "Sustainability",
                description: "We use eco-friendly materials and processes to minimize our environmental impact.",
              },
              {
                title: "Quality",
                description: "Every piece is crafted to meet our high standards of durability and beauty.",
              },
              {
                title: "Community",
                description: "We believe in supporting local artisans and sharing our knowledge.",
              },
              {
                title: "Innovation",
                description: "While respecting tradition, we constantly explore new techniques and designs.",
              },
            ].map((value, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={valuesInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                className="text-center"
              >
                <h3 className="text-xl font-medium text-clay-800 mb-2">
                  {value.title}
                </h3>
                <p className="text-gray-600">{value.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </PageTransition>
  );
};

export default About;