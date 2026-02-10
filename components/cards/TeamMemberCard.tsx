"use client";

import { memo } from "react";
import Image from "next/image";
import { Linkedin, Mail } from "lucide-react";
import { TeamMember } from "@/types";
import { useLanguage } from "@/contexts/LanguageContext";

interface TeamMemberCardProps {
  member: TeamMember;
  /** Compact layout (e.g. for home page strip) */
  compact?: boolean;
}

function TeamMemberCard({ member, compact = false }: TeamMemberCardProps) {
  const { t } = useLanguage();
  const name = t(`about.team.members.${member.id}.name`) || member.name;
  const role = t(`about.team.members.${member.id}.role`) || member.role;
  const bio = t(`about.team.members.${member.id}.bio`) || member.bio;
  const imageUrl = member.image || "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=600&q=80";

  if (compact) {
    return (
      <div className="group group/card bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-modern hover:shadow-modern-lg transition-all duration-500 card-hover">
        <div className="relative aspect-[3/4] overflow-hidden">
          <Image
            src={imageUrl}
            alt={name}
            fill
            sizes="(max-width: 768px) 50vw, 25vw"
            className="object-cover group-hover/card:scale-105 transition-transform duration-700"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover/card:opacity-100 transition-opacity duration-300" />
          <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-full group-hover/card:translate-y-0 transition-transform duration-300">
            <p className="text-white text-sm line-clamp-2">{bio}</p>
          </div>
        </div>
        <div className="p-4 text-center">
          <h3 className="font-bold text-gray-900 group-hover/card:text-primary-600 transition-colors">
            {name}
          </h3>
          <p className="text-sm text-primary-600 font-medium">{role}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="group bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-modern hover:shadow-modern-lg transition-all duration-500 card-hover">
      <div className="relative aspect-[4/5] max-h-80 overflow-hidden">
        <Image
          src={imageUrl}
          alt={name}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover group-hover:scale-105 transition-transform duration-700"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-5">
          <h3 className="text-xl font-bold text-white drop-shadow-lg">{name}</h3>
          <p className="text-primary-200 text-sm font-medium">{role}</p>
        </div>
      </div>
      <div className="p-6">
        <p className="text-gray-600 text-sm leading-relaxed line-clamp-3 mb-4">{bio}</p>
        <div className="flex gap-3">
          <a
            href="#"
            className="flex items-center justify-center w-10 h-10 rounded-xl bg-primary-50 text-primary-600 hover:bg-primary-100 transition-colors"
            aria-label={`LinkedIn ${name}`}
          >
            <Linkedin className="w-5 h-5" />
          </a>
          <a
            href="#"
            className="flex items-center justify-center w-10 h-10 rounded-xl bg-primary-50 text-primary-600 hover:bg-primary-100 transition-colors"
            aria-label={`Email ${name}`}
          >
            <Mail className="w-5 h-5" />
          </a>
        </div>
      </div>
    </div>
  );
}

export default memo(TeamMemberCard);
