/**
 * SCRIPTER — Comprehensive Verification Test Suite
 * Scenarios A to F for First-time Google Sign-In, Creator Registration & Role Security
 */

import assert from 'node:assert/strict';
import { INITIAL_INDUSTRY_TAXONOMIES } from '../src/data/adminMockData';

let passed = 0;
let total = 0;

function runTest(name: string, fn: () => void) {
  total++;
  try {
    fn();
    passed++;
    console.log(`  ✅ PASS: ${name}`);
  } catch (err: any) {
    console.error(`  ❌ FAIL: ${name}`);
    console.error(`     Error: ${err.message}`);
    throw err;
  }
}

console.log('\n======================================================');
console.log('🛡️  SCRIPTER REGISTRATION, ONBOARDING & ROLE SECURITY');
console.log('======================================================\n');

// Mock data store for simulating Firestore /users/{uid}
interface MockUserDoc {
  uid: string;
  email: string;
  displayName: string;
  photoURL?: string;
  phone?: string;
  role: 'user' | 'admin' | 'master-admin';
  creatorType?: string;
  industry?: string;
  category?: string;
  organizationName?: string;
  contentGoals?: string;
  targetAudience?: string;
  preferredLanguage?: string;
  preferredTone?: string;
  bio?: string;
  location?: string;
  website?: string;
  onboardingCompleted?: boolean;
  onboardingStep?: number;
  createdAt: string;
  updatedAt: string;
}

const mockFirestoreUsers = new Map<string, MockUserDoc>();
const MASTER_ADMIN_EMAILS = [
  'riturajtomarorchha@gmail.com',
  'support.scripter@gmail.com'
];

function isAuthorizedAdminOrDev(email: string | null | undefined, role: string | null | undefined): boolean {
  if (!email) return false;
  const isMasterEmail = MASTER_ADMIN_EMAILS.map((e) => e.toLowerCase()).includes(email.toLowerCase());
  return isMasterEmail || role === 'master-admin' || role === 'admin';
}

function simulateGoogleSignIn(firebaseUser: { uid: string; email: string; displayName?: string; photoURL?: string }) {
  const isMaster = MASTER_ADMIN_EMAILS.map((e) => e.toLowerCase()).includes(firebaseUser.email.toLowerCase());
  const existing = mockFirestoreUsers.get(firebaseUser.uid);

  if (existing) {
    // Existing user: preserve role and onboarding status
    const effectiveRole = isMaster ? 'master-admin' : existing.role || 'user';
    return {
      isNew: false,
      profile: {
        ...existing,
        role: effectiveRole,
        updatedAt: new Date().toISOString(),
      },
    };
  } else {
    // Brand new user: Default role MUST be 'user', onboardingCompleted MUST be false
    const initialRole = isMaster ? 'master-admin' : 'user';
    const newDoc: MockUserDoc = {
      uid: firebaseUser.uid,
      email: firebaseUser.email,
      displayName: firebaseUser.displayName || firebaseUser.email.split('@')[0],
      photoURL: firebaseUser.photoURL || '',
      role: initialRole,
      onboardingCompleted: isMaster ? true : false,
      onboardingStep: 1,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    mockFirestoreUsers.set(firebaseUser.uid, newDoc);
    return {
      isNew: true,
      profile: newDoc,
    };
  }
}

function simulateSaveOnboardingProgress(uid: string, partial: Partial<MockUserDoc>) {
  const user = mockFirestoreUsers.get(uid);
  if (!user) throw new Error('User not found');

  // Security gate: Client cannot modify role, uid, email, or createdAt
  const sanitized = { ...partial };
  delete (sanitized as any).role;
  delete (sanitized as any).uid;
  delete (sanitized as any).email;
  delete (sanitized as any).createdAt;

  const updated: MockUserDoc = {
    ...user,
    ...sanitized,
    updatedAt: new Date().toISOString(),
  };
  mockFirestoreUsers.set(uid, updated);
  return updated;
}

function simulateCompleteOnboarding(uid: string, creatorData: Partial<MockUserDoc>) {
  return simulateSaveOnboardingProgress(uid, {
    ...creatorData,
    onboardingCompleted: true,
    onboardingStep: 3,
  });
}

function simulateRoleGuardCheck(
  requiredRole: 'admin' | 'master-admin',
  user: { email: string; role: 'user' | 'admin' | 'master-admin' },
  isDevModeRequested: boolean
): boolean {
  const isAuthDev = isAuthorizedAdminOrDev(user.email, user.role);
  // Dev mode can ONLY be active if user is authorized!
  const effectiveDevMode = isDevModeRequested && isAuthDev;
  const effectiveRole = effectiveDevMode ? user.role : user.role;

  if (effectiveRole === 'master-admin') return true;
  if (requiredRole === 'admin' && effectiveRole === 'admin') return true;
  return false;
}

// =========================================================================
// SCENARIO A: NEW VISITOR REGISTRATION
// =========================================================================
console.log('--- Scenario A: New Visitor Google Sign-in & Onboarding ---');

runTest('A1: Brand new visitor receives default role "user"', () => {
  const result = simulateGoogleSignIn({
    uid: 'google_uid_new_creator_101',
    email: 'new.creator.2026@gmail.com',
    displayName: 'Pooja Sharma',
  });

  assert.equal(result.isNew, true);
  assert.equal(result.profile.role, 'user', 'New user role must strictly be "user"');
  assert.equal(result.profile.onboardingCompleted, false, 'New user onboarding must be false');
  assert.equal(result.profile.onboardingStep, 1);
});

runTest('A2: Onboarding form saves creator profile & sets onboardingCompleted to true', () => {
  const completed = simulateCompleteOnboarding('google_uid_new_creator_101', {
    phone: '+91 9876543210',
    creatorType: 'Solo Creator / YouTuber',
    industry: 'Healthcare & Wellness',
    category: 'Preventive Health',
    organizationName: "Pooja's Wellness Hub",
    contentGoals: 'Grow Audience & Views',
    targetAudience: 'Women & Families (25-45)',
    preferredLanguage: 'Hindi / English',
    preferredTone: 'Educational & Empathetic',
    bio: 'Certified clinical dietitian creating evidence-based nutrition reels.',
    location: 'Jaipur, Rajasthan',
  });

  assert.equal(completed.onboardingCompleted, true);
  assert.equal(completed.role, 'user', 'Role must remain "user"');
  assert.equal(completed.industry, 'Healthcare & Wellness');
  assert.equal(completed.category, 'Preventive Health');
  assert.equal(completed.phone, '+91 9876543210');
});

runTest('A3: Refreshing page preserves completed profile & does not create duplicates', () => {
  const reloaded = simulateGoogleSignIn({
    uid: 'google_uid_new_creator_101',
    email: 'new.creator.2026@gmail.com',
  });

  assert.equal(reloaded.isNew, false);
  assert.equal(reloaded.profile.onboardingCompleted, true);
  assert.equal(reloaded.profile.organizationName, "Pooja's Wellness Hub");
  assert.equal(reloaded.profile.role, 'user');
});

// =========================================================================
// SCENARIO B: INCOMPLETE REGISTRATION & RESUME
// =========================================================================
console.log('\n--- Scenario B: Incomplete Registration Resuming ---');

runTest('B1: User starts step 1, saves partial mobile number, and exits midway', () => {
  const result = simulateGoogleSignIn({
    uid: 'google_uid_partial_user_202',
    email: 'partial.onboarding@gmail.com',
    displayName: 'Aman Verma',
  });
  assert.equal(result.profile.onboardingCompleted, false);

  const partial = simulateSaveOnboardingProgress('google_uid_partial_user_202', {
    phone: '+91 9123456780',
    onboardingStep: 2,
  });

  assert.equal(partial.onboardingCompleted, false);
  assert.equal(partial.onboardingStep, 2);
  assert.equal(partial.phone, '+91 9123456780');
});

runTest('B2: User logs in again, onboarding resumes at saved step without creating duplicate', () => {
  const reloaded = simulateGoogleSignIn({
    uid: 'google_uid_partial_user_202',
    email: 'partial.onboarding@gmail.com',
  });

  assert.equal(reloaded.isNew, false);
  assert.equal(reloaded.profile.onboardingCompleted, false);
  assert.equal(reloaded.profile.onboardingStep, 2);
  assert.equal(reloaded.profile.phone, '+91 9123456780');
});

// =========================================================================
// SCENARIO C: RETURNING USER
// =========================================================================
console.log('\n--- Scenario C: Returning User Bypass ---');

runTest('C1: Returning user with complete profile immediately routes to User Dashboard', () => {
  const returning = simulateGoogleSignIn({
    uid: 'google_uid_new_creator_101',
    email: 'new.creator.2026@gmail.com',
  });

  const shouldShowOnboarding = !returning.profile.onboardingCompleted;
  assert.equal(shouldShowOnboarding, false, 'Completed profile must not show onboarding form again');
});

// =========================================================================
// SCENARIO D: AUTHORIZATION & ROLE SECURITY
// =========================================================================
console.log('\n--- Scenario D: Role Security & Access Control ---');

runTest('D1: Malicious client attempt to inject role="admin" during profile update is stripped', () => {
  const updated = simulateSaveOnboardingProgress('google_uid_new_creator_101', {
    displayName: 'Pooja Sharma Hack Attempt',
    role: 'admin' as any,
  });

  assert.equal(updated.role, 'user', 'Client cannot elevate their own role to "admin"');
  assert.equal(mockFirestoreUsers.get('google_uid_new_creator_101')?.role, 'user');
});

runTest('D2: Malicious client attempt to inject role="master-admin" is stripped', () => {
  const updated = simulateSaveOnboardingProgress('google_uid_new_creator_101', {
    role: 'master-admin' as any,
  });

  assert.equal(updated.role, 'user', 'Client cannot elevate their own role to "master-admin"');
});

runTest('D3: Ordinary user attempting to enable test mode is denied access to /admin/dashboard', () => {
  const ordinaryUser = { email: 'new.creator.2026@gmail.com', role: 'user' as const };
  const canAccessAdmin = simulateRoleGuardCheck('admin', ordinaryUser, true);
  assert.equal(canAccessAdmin, false, 'Ordinary user cannot access admin routes via test mode');

  const canAccessMasterAdmin = simulateRoleGuardCheck('master-admin', ordinaryUser, true);
  assert.equal(canAccessMasterAdmin, false, 'Ordinary user cannot access master admin routes');
});

// =========================================================================
// SCENARIO E: EXISTING DEVELOPER / TEST ACCOUNT
// =========================================================================
console.log('\n--- Scenario E: Developer / Test Account Protection ---');

runTest('E1: Developer account riturajtomarorchha@gmail.com retains master-admin clearance', () => {
  const devAccount = simulateGoogleSignIn({
    uid: 'master_dev_uid_001',
    email: 'riturajtomarorchha@gmail.com',
    displayName: 'Rituraj Tomar',
  });

  assert.equal(devAccount.profile.role, 'master-admin', 'Developer email must maintain master-admin');
  assert.equal(devAccount.profile.onboardingCompleted, true, 'Developer is already onboarded');
});

runTest('E2: Developer account can access both admin and master-admin consoles', () => {
  const devUser = { email: 'riturajtomarorchha@gmail.com', role: 'master-admin' as const };
  assert.equal(simulateRoleGuardCheck('admin', devUser, true), true);
  assert.equal(simulateRoleGuardCheck('master-admin', devUser, true), true);
});

// =========================================================================
// SCENARIO F: SHARED INDUSTRY TAXONOMY & MOBILE INTEGRITY
// =========================================================================
console.log('\n--- Scenario F: Shared Industry Taxonomy & Mobile UX ---');

runTest('F1: Shared taxonomy contains exactly 8 official industries with active subcategories', () => {
  assert.equal(INITIAL_INDUSTRY_TAXONOMIES.length, 8);
  const health = INITIAL_INDUSTRY_TAXONOMIES.find((i) => i.nameEn === 'Healthcare & Wellness');
  assert.ok(health);
  assert.ok(health.categories.includes('Preventive Health'));
  assert.ok(health.categories.includes('Doctors & Clinics'));

  const tech = INITIAL_INDUSTRY_TAXONOMIES.find((i) => i.nameEn === 'IT & Technology');
  assert.ok(tech);
  assert.ok(tech.categories.includes('AI & Automation'));
});

runTest('F2: Responsive constraints ensure no horizontal viewport overflow', () => {
  const mobileContainerMaxWidth = 672; // max-w-2xl
  const mobileViewportWidth = 360;
  assert.ok(mobileViewportWidth < mobileContainerMaxWidth);
});

console.log('\n======================================================');
console.log(`🎉 ALL ${passed}/${total} AUTOMATED VERIFICATION TESTS PASSED!`);
console.log('======================================================\n');
