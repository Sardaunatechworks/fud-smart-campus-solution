import React from 'react';
import { motion } from 'motion/react';
import { Github, Linkedin, Twitter, Globe } from 'lucide-react';

const Team = () => {
  const team = [
    {
      name: 'Abubakar Tijjani',
      role: 'Lead Developer',
      image: 'https://picsum.photos/seed/dev1/400/400',
      bio: 'Full-stack developer passionate about building campus solutions.',
      socials: { github: '#', linkedin: '#', twitter: '#' }
    },
    {
      name: 'Fatima Musa',
      role: 'UI/UX Designer',
      image: 'https://picsum.photos/seed/dev2/400/400',
      bio: 'Creative designer focused on student-friendly interfaces.',
      socials: { globe: '#', linkedin: '#', twitter: '#' }
    },
    {
      name: 'Ibrahim Sani',
      role: 'Backend Engineer',
      image: 'https://picsum.photos/seed/dev3/400/400',
      bio: 'Specialist in secure database architecture and API design.',
      socials: { github: '#', linkedin: '#' }
    }
  ];

  return (
    <div className="space-y-12">
      <div className="text-center max-w-2xl mx-auto">
        <h1 className="text-4xl font-bold text-slate-900 mb-4">Project Team</h1>
        <p className="text-slate-500 text-lg">Meet the brilliant minds behind the FUD Smart Campus Lost & Found Platform.</p>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        {team.map((member, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-white rounded-3xl overflow-hidden border border-slate-100 card-shadow group"
          >
            <div className="h-64 overflow-hidden">
              <img 
                src={member.image} 
                alt={member.name}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="p-8 text-center">
              <h3 className="text-xl font-bold text-slate-900 mb-1">{member.name}</h3>
              <p className="text-fud-green font-semibold text-sm mb-4 uppercase tracking-wider">{member.role}</p>
              <p className="text-slate-500 text-sm mb-6 leading-relaxed">{member.bio}</p>
              
              <div className="flex items-center justify-center gap-4">
                {member.socials.github && (
                  <a href={member.socials.github} className="w-10 h-10 bg-slate-50 text-slate-400 rounded-xl flex items-center justify-center hover:bg-slate-900 hover:text-white transition-all">
                    <Github size={18} />
                  </a>
                )}
                {member.socials.linkedin && (
                  <a href={member.socials.linkedin} className="w-10 h-10 bg-slate-50 text-slate-400 rounded-xl flex items-center justify-center hover:bg-blue-600 hover:text-white transition-all">
                    <Linkedin size={18} />
                  </a>
                )}
                {member.socials.twitter && (
                  <a href={member.socials.twitter} className="w-10 h-10 bg-slate-50 text-slate-400 rounded-xl flex items-center justify-center hover:bg-sky-500 hover:text-white transition-all">
                    <Twitter size={18} />
                  </a>
                )}
                {member.socials.globe && (
                  <a href={member.socials.globe} className="w-10 h-10 bg-slate-50 text-slate-400 rounded-xl flex items-center justify-center hover:bg-fud-green hover:text-white transition-all">
                    <Globe size={18} />
                  </a>
                )}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default Team;
