
import { useEffect } from 'react';
import { motion } from 'framer-motion';

const AboutPage = () => {
  useEffect(() => {
    // Set page title
    document.title = "About | CultureDrop";
    
    // Scroll to top when component mounts
    window.scrollTo(0, 0);
  }, []);

  return (
    <>
      <section className="py-12 px-4 bg-secondary/50">
        <div className="container mx-auto">
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-4">About CultureDrop</h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Where music and fashion unite to celebrate global urban cultures.
            </p>
          </div>
        </div>
      </section>

      <section className="py-16 px-4">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true, margin: "-100px" }}
            >
              <h2 className="text-3xl font-bold mb-6">Our Story</h2>
              <p className="text-muted-foreground mb-4">
                CultureDrop was born from a passion for the intersections between music, fashion, and cultural identity. 
                We believe that urban cultures around the world create unique expressions that deserve to be celebrated and shared.
              </p>
              <p className="text-muted-foreground">
                Founded in 2025 by a collective of Polytehnica Timisoara students,
                CultureDrop aims to bring authentic products inspired by global urban cultures to people everywhere.
              </p>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true, margin: "-100px" }}
              className="aspect-square bg-muted rounded-lg overflow-hidden"
            >
              {/* This would be a real image in a production app */}
              <div className="w-full h-full bg-gradient-to-br from-culture to-culture-accent/50" />
            </motion.div>
          </div>
        </div>
      </section>

      <section className="py-16 px-4 bg-secondary/50">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold mb-12 text-center">Our Values</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              viewport={{ once: true, margin: "-100px" }}
              className="bg-card p-6 rounded-lg shadow-sm"
            >
              <h3 className="text-xl font-bold mb-4">Cultural Authenticity</h3>
              <p className="text-muted-foreground">
                We work directly with artists and designers from each culture to ensure our products are authentic representations rather than appropriations.
              </p>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              viewport={{ once: true, margin: "-100px" }}
              className="bg-card p-6 rounded-lg shadow-sm"
            >
              <h3 className="text-xl font-bold mb-4">Creative Expression</h3>
              <p className="text-muted-foreground">
                We believe in the power of music and fashion to express identity, challenge norms, and create community across borders and boundaries.
              </p>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              viewport={{ once: true, margin: "-100px" }}
              className="bg-card p-6 rounded-lg shadow-sm"
            >
              <h3 className="text-xl font-bold mb-4">Sustainability</h3>
              <p className="text-muted-foreground">
                We're committed to ethical production methods and environmentally responsible practices across our entire supply chain.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="py-16 px-4">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold mb-12 text-center">Our Team</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[1, 2, 3, 4].map((_, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true, margin: "-100px" }}
                className="text-center"
              >
                <div className="aspect-square bg-muted rounded-full overflow-hidden mx-auto mb-4 w-40 h-40">
                  {/* This would be a real team member photo in a production app */}
                  <div className="w-full h-full bg-gradient-to-br from-culture to-culture-accent/50" />
                </div>
                <h3 className="font-bold">Team Member {index + 1}</h3>
                <p className="text-sm text-muted-foreground">Position</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
};

export default AboutPage;
