import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Profile, Strategy } from 'passport-github2';

@Injectable()
export class GithubStrategy extends PassportStrategy(Strategy, 'github') {
  constructor() {
    super({
      clientID: process.env.GITHUB_ID!,
      clientSecret: process.env.GITHUB_SECRET!,
      callbackURL: 'http://localhost:3000/callback',
      scope: ['public_profile'],
    });
  }

  validate(accessToken: string, refreshToken: string, profile: Profile) {
    console.log('profile: ', profile);
    return profile;
  }
}
