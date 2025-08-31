import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Profile } from 'passport';
import { Strategy, VerifyCallback } from 'passport-google-oauth2';
import { PassportUser } from 'src/common/types/types';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy) {
  constructor(private cfg: ConfigService) {
    super({
      clientID: cfg.get<string>('GOOGLE_CLIENT_ID')!,
      clientSecret: cfg.get<string>('GOOGLE_CLIENT_SECRET')!,
      callbackURL: cfg.get<string>('GOOGLE_CALLBACK')!,
      scope: ['email', 'profile'],
    });
  }

  validate(
    _accessToken: string,
    _refreshToken: string,
    profile: Profile,
    done: VerifyCallback,
  ) {
    const user : PassportUser = {
      email: profile.emails?.[0]?.value!,
      avatar: profile.photos?.[0]?.value!,
      name: `${profile.name?.givenName} ${profile.name?.familyName}`,
      provider: profile.provider,
      id: profile.id,
    };

    done(null, user);
  }
}
