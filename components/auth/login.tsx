'use client';

import Link from 'next/link';
import { useActionState, useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { Button2 } from '@/components/ui/button';
import { Input, InputError } from '@/components/ui/input';
import { Label2 } from '@/components/ui/label';
import { Loader2, Pin, Eye, EyeOff } from 'lucide-react';
import { signIn } from '@/actions/sign-in';
import { signUp } from '@/actions/sign-up';
import { acceptInvitation } from '@/actions/invitation';
import { ActionState } from '@/auth/middleware';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { REGIONS_AND_CITIES } from '@/config/locations';
import { bloodGroups, getBloodGroupLabel } from '@/config/blood-group';
import { Alert, AlertDescription } from '@/components/ui/alert';

type LoginProps = {
    mode?: 'signin' | 'signup' | 'accept-invitation';
    dict: any;
    isRTL?: boolean;
};

export function Login({ mode = 'signin', dict, isRTL }: LoginProps) {
    const searchParams = useSearchParams();
    const token = searchParams.get('token');
    const email = searchParams.get('email');
    const verificationStatus = searchParams.get('verification');
    const resetStatus = searchParams.get('reset');
    const [selectedRegion, setSelectedRegion] = useState<string>();
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [signupFormData, setSignupFormData] = useState({
        name: '',
        email: '',
        phone: '',
        bloodGroup: '',
        region: '',
        cityId: '',
        notificationLanguage: 'fr',
    });
    const [state, formAction, pending] = useActionState<ActionState, FormData>(
        mode === 'signin'
            ? signIn
            : mode === 'signup'
              ? signUp
              : acceptInvitation,
        { error: '' },
    );

    // Restore sign-up form from action state when an error is returned
    useEffect(() => {
        if (mode !== 'signup' || !state?.error) return;
        const s = state as ActionState & Record<string, string | undefined>;
        if (s.email === undefined && s.name === undefined) return;
        setSignupFormData(prev => ({
            name: s.name ?? prev.name,
            email: s.email ?? prev.email,
            phone: s.phone ?? prev.phone,
            bloodGroup: s.bloodGroup ?? prev.bloodGroup,
            region: s.region ?? prev.region,
            cityId: s.cityId ?? prev.cityId,
            notificationLanguage:
                s.notificationLanguage ?? prev.notificationLanguage,
        }));
        if (s.region) setSelectedRegion(s.region);
    }, [mode, state]);

    // Redirect to sign-in if trying to accept invitation without token
    if (mode === 'accept-invitation' && !token) {
        return (
            <div className="text-center">
                <h2 className="text-2xl font-bold text-foreground mb-4">
                    {dict.auth.invitation.invalid}
                </h2>
                <p className="text-muted-foreground mb-6">
                    {dict.auth.invitation.invalidMessage}
                </p>
                <Link
                    href="/sign-in"
                    className="text-muted-foreground hover:text-foreground underline rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-500"
                >
                    {dict.auth.invitation.returnToSignIn}
                </Link>
            </div>
        );
    }

    const isRegistrationMode =
        mode === 'signup' || mode === 'accept-invitation';

    return (
        <>
            {mode === 'accept-invitation' && (
                <>
                    <h2 className="text-2xl font-medium text-center text-foreground">
                        {dict.auth.invitation.completeRegistration}
                    </h2>
                    <p className="mt-2 text-center text-sm text-muted-foreground">
                        {dict.auth.invitation.setupMessage}
                    </p>
                </>
            )}

            {mode === 'signup' && (
                <Alert variant="information" className="mt-4">
                    <Pin className="h-4 w-4" />
                    <AlertDescription>
                        {dict.auth.signUp.consentMessage}
                    </AlertDescription>
                </Alert>
            )}

            {mode === 'signin' && verificationStatus === 'sent' && (
                <Alert className="mt-4">
                    <AlertDescription>
                        {dict.auth.verifyEmail.checkInbox}
                    </AlertDescription>
                </Alert>
            )}

            {mode === 'signin' && resetStatus === 'success' && (
                <Alert className="mt-4 border-green-600/50 bg-green-50 dark:bg-green-950/20">
                    <AlertDescription className="text-green-800 dark:text-green-400">
                        {dict.auth.forgotPassword.passwordResetSuccess}
                    </AlertDescription>
                </Alert>
            )}

            <form className="mt-6 space-y-4" action={formAction}>
                {mode === 'accept-invitation' && (
                    <input type="hidden" name="token" value={token || ''} />
                )}

                {isRegistrationMode && (
                    <div>
                        <Label2 htmlFor="name">
                            {dict.forms.labels.fullName}
                        </Label2>
                        <Input
                            id="name"
                            name="name"
                            type="text"
                            required
                            maxLength={100}
                            className="block mt-1 w-full"
                            placeholder={dict.forms.placeholders.enterFullName}
                            value={
                                mode === 'signup'
                                    ? signupFormData.name
                                    : undefined
                            }
                            onChange={
                                mode === 'signup'
                                    ? e =>
                                          setSignupFormData(prev => ({
                                              ...prev,
                                              name: e.target.value,
                                          }))
                                    : undefined
                            }
                        />
                    </div>
                )}

                <div>
                    <Label2 htmlFor="email">{dict.forms.labels.email}</Label2>
                    <Input
                        id="email"
                        name="email"
                        type="email"
                        autoComplete="email"
                        required
                        maxLength={255}
                        value={
                            mode === 'signup' ? signupFormData.email : undefined
                        }
                        defaultValue={
                            mode === 'accept-invitation'
                                ? email || ''
                                : undefined
                        }
                        readOnly={mode === 'accept-invitation' && !!email}
                        className="block mt-1 w-full"
                        placeholder={dict.forms.placeholders.enterEmail}
                        onChange={
                            mode === 'signup'
                                ? e =>
                                      setSignupFormData(prev => ({
                                          ...prev,
                                          email: e.target.value,
                                      }))
                                : undefined
                        }
                    />
                </div>

                <div>
                    <Label2 htmlFor="password">
                        {mode === 'signin'
                            ? dict.auth.signIn.password
                            : dict.auth.signUp.createPassword}
                    </Label2>
                    <div className="relative">
                        <Input
                            id="password"
                            name="password"
                            type={showPassword ? 'text' : 'password'}
                            autoComplete={
                                mode === 'signin'
                                    ? 'current-password'
                                    : 'new-password'
                            }
                            required
                            minLength={8}
                            maxLength={100}
                            className="block mt-1 w-full pr-10 rtl:pr-4 rtl:pl-10"
                            placeholder={
                                mode === 'signin'
                                    ? dict.auth.signIn.enterPassword
                                    : dict.auth.signUp.createSecurePassword
                            }
                        />
                        <button
                            type="button"
                            className="absolute inset-y-0 right-0 flex items-center pr-3 rtl:right-auto rtl:left-0 rtl:pr-0 rtl:pl-3"
                            onClick={() => setShowPassword(!showPassword)}
                        >
                            {showPassword ? (
                                <EyeOff className="h-4 w-4 text-muted-foreground hover:text-foreground" />
                            ) : (
                                <Eye className="h-4 w-4 text-muted-foreground hover:text-foreground" />
                            )}
                        </button>
                    </div>
                    {isRegistrationMode && (
                        <p className="mt-1 text-sm text-muted-foreground">
                            {dict.forms.validation.passwordRequirements}
                        </p>
                    )}
                </div>

                {isRegistrationMode && (
                    <div>
                        <Label2 htmlFor="confirmPassword">
                            {dict.forms.labels.confirmPassword}
                        </Label2>
                        <div className="relative">
                            <Input
                                id="confirmPassword"
                                name="confirmPassword"
                                type={showConfirmPassword ? 'text' : 'password'}
                                autoComplete="new-password"
                                required
                                minLength={8}
                                maxLength={100}
                                className="block mt-1 w-full pr-10 rtl:pr-4 rtl:pl-10"
                                placeholder={
                                    dict.forms.placeholders.confirmPassword
                                }
                            />
                            <button
                                type="button"
                                className="absolute inset-y-0 right-0 flex items-center pr-3 rtl:right-auto rtl:left-0 rtl:pr-0 rtl:pl-3"
                                onClick={() =>
                                    setShowConfirmPassword(!showConfirmPassword)
                                }
                            >
                                {showConfirmPassword ? (
                                    <EyeOff className="h-4 w-4 text-muted-foreground hover:text-foreground" />
                                ) : (
                                    <Eye className="h-4 w-4 text-muted-foreground hover:text-foreground" />
                                )}
                            </button>
                        </div>
                    </div>
                )}

                {isRegistrationMode && (
                    <>
                        <div>
                            <Label2 htmlFor="phone">
                                {dict.forms.labels.phoneNumber}
                            </Label2>
                            <Input
                                id="phone"
                                name="phone"
                                type="tel"
                                dir={isRTL ? 'rtl' : 'ltr'}
                                maxLength={20}
                                className="block mt-1 w-full"
                                placeholder={
                                    dict.forms.placeholders.enterPhoneNumber
                                }
                                value={
                                    mode === 'signup'
                                        ? signupFormData.phone
                                        : undefined
                                }
                                onChange={
                                    mode === 'signup'
                                        ? e =>
                                              setSignupFormData(prev => ({
                                                  ...prev,
                                                  phone: e.target.value,
                                              }))
                                        : undefined
                                }
                            />
                        </div>

                        {mode === 'signup' && (
                            <div>
                                <Label2 htmlFor="bloodGroup">
                                    {dict.forms.labels.bloodGroup}
                                </Label2>
                                <Select
                                    name="bloodGroup"
                                    dir={isRTL ? 'rtl' : 'ltr'}
                                    required
                                    value={
                                        signupFormData.bloodGroup || undefined
                                    }
                                    onValueChange={value =>
                                        setSignupFormData(prev => ({
                                            ...prev,
                                            bloodGroup: value ?? '',
                                        }))
                                    }
                                >
                                    <SelectTrigger>
                                        <SelectValue
                                            placeholder={
                                                dict.forms.placeholders
                                                    .selectBloodGroup
                                            }
                                        />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {bloodGroups.map(group => (
                                            <SelectItem
                                                key={group.value}
                                                value={group.value}
                                            >
                                                {getBloodGroupLabel(
                                                    group.value,
                                                    dict,
                                                )}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        )}

                        <div>
                            <Label2 htmlFor="region">
                                {dict.forms.labels.region}
                            </Label2>
                            <Select
                                name="region"
                                value={
                                    (mode === 'signup'
                                        ? signupFormData.region
                                        : selectedRegion) || undefined
                                }
                                onValueChange={(value: string) => {
                                    setSelectedRegion(value);
                                    if (mode === 'signup') {
                                        setSignupFormData(prev => ({
                                            ...prev,
                                            region: value ?? '',
                                            cityId: '',
                                        }));
                                    }
                                }}
                                dir={isRTL ? 'rtl' : 'ltr'}
                                required
                            >
                                <SelectTrigger>
                                    <SelectValue
                                        placeholder={
                                            dict.forms.placeholders.selectRegion
                                        }
                                    />
                                </SelectTrigger>
                                <SelectContent>
                                    {REGIONS_AND_CITIES.map(region => (
                                        <SelectItem
                                            key={region.id}
                                            value={region.id.toString()}
                                        >
                                            {isRTL
                                                ? region.nameAr
                                                : region.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div>
                            <Label2 htmlFor="cityId">
                                {dict.forms.labels.city}
                            </Label2>
                            <Select
                                name="cityId"
                                dir={isRTL ? 'rtl' : 'ltr'}
                                disabled={
                                    !(mode === 'signup'
                                        ? signupFormData.region
                                        : selectedRegion)
                                }
                                required
                                value={
                                    (mode === 'signup'
                                        ? signupFormData.cityId
                                        : undefined) || undefined
                                }
                                onValueChange={value =>
                                    mode === 'signup' &&
                                    setSignupFormData(prev => ({
                                        ...prev,
                                        cityId: value ?? '',
                                    }))
                                }
                            >
                                <SelectTrigger>
                                    <SelectValue
                                        placeholder={
                                            dict.forms.placeholders.selectCity
                                        }
                                    />
                                </SelectTrigger>
                                <SelectContent>
                                    {selectedRegion &&
                                        REGIONS_AND_CITIES.find(
                                            r =>
                                                r.id.toString() ===
                                                selectedRegion,
                                        )?.cities.map(city => (
                                            <SelectItem
                                                key={city.id}
                                                value={city.id.toString()}
                                            >
                                                {isRTL
                                                    ? city.nameAr
                                                    : city.name}
                                            </SelectItem>
                                        ))}
                                </SelectContent>
                            </Select>
                        </div>

                        {mode === 'signup' && (
                            <div>
                                <Label2 htmlFor="notificationLanguage">
                                    {dict.forms.labels.notificationLanguage}
                                </Label2>
                                <Select
                                    name="notificationLanguage"
                                    dir={isRTL ? 'rtl' : 'ltr'}
                                    value={
                                        signupFormData.notificationLanguage ||
                                        'fr'
                                    }
                                    onValueChange={value =>
                                        setSignupFormData(prev => ({
                                            ...prev,
                                            notificationLanguage: value ?? 'fr',
                                        }))
                                    }
                                >
                                    <SelectTrigger>
                                        <SelectValue
                                            placeholder={
                                                dict.forms.placeholders
                                                    .selectNotificationLanguage
                                            }
                                        />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="fr">
                                            Français
                                        </SelectItem>
                                        <SelectItem value="en">
                                            English
                                        </SelectItem>
                                        <SelectItem value="ar">
                                            العربية
                                        </SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        )}
                    </>
                )}

                {state?.error && (
                    <InputError messages={[state.error]} className="mt-2" />
                )}

                {mode === 'signin' && (
                    <div className="text-right">
                        <Link
                            href="/forgot-password"
                            className="text-sm text-muted-foreground hover:text-foreground underline rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-500"
                        >
                            {dict.auth.signIn.forgotPassword}
                        </Link>
                    </div>
                )}

                <div className="flex items-center justify-end">
                    <Button2
                        className="w-full justify-center"
                        disabled={pending}
                    >
                        {pending ? (
                            <>
                                <Loader2 className="animate-spin mr-2 h-4 w-4" />
                                {dict.common.loading}
                            </>
                        ) : mode === 'signin' ? (
                            dict.auth.signIn.title
                        ) : mode === 'signup' ? (
                            dict.auth.signUp.title
                        ) : (
                            dict.common.createAccount
                        )}
                    </Button2>
                </div>
            </form>

            <div className="mt-6">
                <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-border" />
                    </div>
                    <div className="relative flex justify-center text-sm">
                        <span className="px-2 bg-card text-muted-foreground">
                            {mode === 'signin'
                                ? dict.auth.signIn.needAccount
                                : dict.auth.signUp.haveAccount}
                        </span>
                    </div>
                </div>

                <div className="mt-6 text-center">
                    {mode === 'signin' ? (
                        <>
                            <Link
                                href="/sign-up"
                                className="text-sm text-muted-foreground hover:text-foreground underline"
                            >
                                {dict.auth.signIn.signUpLink}
                            </Link>
                        </>
                    ) : (
                        <Link
                            href="/sign-in"
                            className="text-sm text-muted-foreground hover:text-foreground underline"
                        >
                            {dict.auth.signUp.signInLink}
                        </Link>
                    )}
                </div>
            </div>
        </>
    );
}
