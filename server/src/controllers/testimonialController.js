import prisma from '../config/database.js';

export const getAllTestimonials = async (req, res) => {
  try {
    const testimonials = await prisma.testimonial.findMany({
      orderBy: { createdAt: 'desc' },
    });
    res.json({ testimonials });
  } catch (error) {
    console.error('GetAllTestimonials error:', error);
    res.status(500).json({ error: 'Failed to fetch testimonials' });
  }
};
