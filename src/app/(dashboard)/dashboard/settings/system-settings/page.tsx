"use client";

import { useContextConsumer } from "@/context/Context";
import TabLayout from "@/components/layout/TabLayout";
import { Toaster } from "react-hot-toast";
import { Button } from "@/components/ui/button";
import { Pencil, PlusCircle } from "lucide-react";
import { SkeletonCard } from "@/components/Loaders/SkeletonLoader";
import {
  useGetEmailRewards,
  useGetReferralBonus,
  useGetSignupBonus,
  useGetWithdrawThreshold,
} from "@/hooks/apis/useSystemSettings";
import { Badge } from "@/components/ui/badge";
import EmailRewardModal from "@/components/Forms/forms-modal/system-settings/AddEmailReward";
import { useState } from "react";
import WithdrawlThresholdModal from "@/components/Forms/forms-modal/system-settings/withdrawl-threshold/AddWithdrawlThreshold";
import SignupBonusModal from "@/components/Forms/forms-modal/system-settings/signup-bonus/AddSignBonus";
import ReferralBonusModal from "@/components/Forms/forms-modal/system-settings/referral-bonus/AddReferralBonus";

export default function SystemSettings() {
  const { token } = useContextConsumer();

  //email reward
  const [isAddRewardModalOpen, setIsAddRewardModalOpen] = useState(false);
  const [isUpdateRewardModalOpen, setIsUpdateRewardModalOpen] = useState(false);
  const [viewReward, setViewReward] = useState({});

  //withdraw threshold states
  const [isAddThreshldModalOpen, setIsAddThreshldModalOpen] = useState(false);
  const [isUpdateThreshldModalOpen, setIsUpdateThreshldModalOpen] =
    useState(false);
  const [viewThreshld, setViewThreshld] = useState({});

  //signup bonus
  const [isAddSBonusModalOpen, setIsAddSBonusModalOpen] = useState(false);
  const [isUpdateSBonusModalOpen, setIsUpdateSBonusModalOpen] = useState(false);
  const [viewSBonus, setViewSBonus] = useState({});

  //referral bonus
  const [isAddRBonusModalOpen, setIsAddSRModalOpen] = useState(false);
  const [isUpdateRBonusModalOpen, setIsUpdateRBonusModalOpen] = useState(false);
  const [viewRBonus, setViewRBonus] = useState({});

  const { data: emailReward, isLoading } = useGetEmailRewards(token);
  const { data: withdrawlThreshold, isLoading: withdrawlThresholdLoading } =
    useGetWithdrawThreshold(token);
  const { data: signupBonus, isLoading: signupBonusLoading } =
    useGetSignupBonus(token);
  const { data: referralBonus, isLoading: referralBonusLoading } =
    useGetReferralBonus(token);

  // values
  const rewardValue = emailReward?.data?.defaultEmailReward;
  const thresholdValue = withdrawlThreshold?.data?.referralWithdrawalThreshold;
  const signupBonusValue = signupBonus?.data?.defaultSignupBonus;
  const referralBonusValues = referralBonus?.data?.defaultReferralBonus;

  const handleView = (reward: any) => {
    setIsUpdateRewardModalOpen(true);
    setViewReward(reward);
  };

  const handleThresholdView = (threshold: any) => {
    setIsUpdateThreshldModalOpen(true);
    setViewThreshld(threshold);
  };

  const handleSBonusView = (sBonus: any) => {
    setIsUpdateSBonusModalOpen(true);
    setViewSBonus(sBonus);
  };

  const handleRBonusView = (sBonus: any) => {
    setIsUpdateRBonusModalOpen(true);
    setViewRBonus(sBonus);
  };

  return (
    <>
      <Toaster />
      <TabLayout>
        <div className="space-y-6 p-4 rounded-2xl max-w-3xl">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-primary mb-4">
              System Settings
            </h2>
          </div>

          <div className="rounded-2xl border border-gray-200 dark:border-zinc-700 bg-gradient-to-br from-white via-gray-50 to-gray-100 dark:from-zinc-900 dark:via-zinc-800 dark:to-zinc-900 p-6">
            <div className="flex items-center justify-between mb-4 gap-6">
              <div>
                <h3 className="text-md font-semibold text-gray-800 dark:text-gray-100">
                  Default Email Reward
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  This reward is granted for every valid email entry.
                </p>
              </div>
              {isLoading ? null : !rewardValue ? (
                <Button
                  size="sm"
                  variant="outline"
                  className="text-sm flex items-center gap-2"
                  onClick={() => setIsAddRewardModalOpen(true)}
                >
                  <PlusCircle className="w-4 h-4" />
                </Button>
              ) : (
                <Button
                  size="sm"
                  variant="outline"
                  className="text-sm flex items-center gap-2"
                  onClick={() => handleView(rewardValue)}
                >
                  <Pencil className="w-4 h-4" />
                </Button>
              )}
            </div>
            {isLoading ? (
              <SkeletonCard className="w-full h-16" />
            ) : (
              <div className="flex items-center gap-4">
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  Current Reward:
                </span>
                <Badge
                  variant="default"
                  className="text-sm px-3 py-1 rounded-full"
                >
                  {rewardValue
                    ? `${rewardValue} Rupees`
                    : "No Email Reward Added"}
                </Badge>
              </div>
            )}
          </div>
          <div className="rounded-2xl border border-gray-200 dark:border-zinc-700 bg-gradient-to-br from-white via-gray-50 to-gray-100 dark:from-zinc-900 dark:via-zinc-800 dark:to-zinc-900 p-6">
            <div className="flex items-center justify-between mb-4 gap-6">
              <div>
                <h3 className="text-md font-semibold text-gray-800 dark:text-gray-100">
                  Withdrawl Threshold
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  Withdrawl Threshold
                </p>
              </div>
              {withdrawlThresholdLoading ? null : !thresholdValue ? (
                <Button
                  size="sm"
                  variant="outline"
                  className="text-sm flex items-center gap-2"
                  onClick={() => setIsAddThreshldModalOpen(true)}
                >
                  <PlusCircle className="w-4 h-4" />
                </Button>
              ) : (
                <Button
                  size="sm"
                  variant="outline"
                  className="text-sm flex items-center gap-2"
                  onClick={() => handleThresholdView(thresholdValue)}
                >
                  <Pencil className="w-4 h-4" />
                </Button>
              )}
            </div>
            {withdrawlThresholdLoading ? (
              <SkeletonCard className="w-full h-16" />
            ) : (
              <div className="flex items-center gap-4">
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  Current Reward:
                </span>
                <Badge
                  variant="default"
                  className="text-sm px-3 py-1 rounded-full"
                >
                  {thresholdValue
                    ? `${thresholdValue} Rupees`
                    : "No Withdraw threshold added"}
                </Badge>
              </div>
            )}
          </div>
          <div className="rounded-2xl border border-gray-200 dark:border-zinc-700 bg-gradient-to-br from-white via-gray-50 to-gray-100 dark:from-zinc-900 dark:via-zinc-800 dark:to-zinc-900 p-6">
            <div className="flex items-center justify-between mb-4 gap-6">
              <div>
                <h3 className="text-md font-semibold text-gray-800 dark:text-gray-100">
                  Signup Bonus
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  Signup Bonus
                </p>
              </div>
              {signupBonusLoading ? null : !signupBonusValue ? (
                <Button
                  size="sm"
                  variant="outline"
                  className="text-sm flex items-center gap-2"
                  onClick={() => setIsAddSBonusModalOpen(true)}
                >
                  <PlusCircle className="w-4 h-4" />
                </Button>
              ) : (
                <Button
                  size="sm"
                  variant="outline"
                  className="text-sm flex items-center gap-2"
                  onClick={() => handleSBonusView(signupBonusValue)}
                >
                  <Pencil className="w-4 h-4" />
                </Button>
              )}
            </div>
            {signupBonusLoading ? (
              <SkeletonCard className="w-full h-16" />
            ) : (
              <div className="flex items-center gap-4">
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  Current Reward:
                </span>
                <Badge
                  variant="default"
                  className="text-sm px-3 py-1 rounded-full"
                >
                  {signupBonusValue
                    ? `${signupBonusValue} Rupees`
                    : "No signup bonus added"}
                </Badge>
              </div>
            )}
          </div>
          <div className="rounded-2xl border border-gray-200 dark:border-zinc-700 bg-gradient-to-br from-white via-gray-50 to-gray-100 dark:from-zinc-900 dark:via-zinc-800 dark:to-zinc-900 p-6">
            <div className="flex items-center justify-between mb-4 gap-6">
              <div>
                <h3 className="text-md font-semibold text-gray-800 dark:text-gray-100">
                  Referral Bonus
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  Referral Bonus
                </p>
              </div>
              {referralBonusLoading ? null : !referralBonusValues ? (
                <Button
                  size="sm"
                  variant="outline"
                  className="text-sm flex items-center gap-2"
                  onClick={() => setIsAddSRModalOpen(true)}
                >
                  <PlusCircle className="w-4 h-4" />
                </Button>
              ) : (
                <Button
                  size="sm"
                  variant="outline"
                  className="text-sm flex items-center gap-2"
                  onClick={() => handleRBonusView(referralBonusValues)}
                >
                  <Pencil className="w-4 h-4" />
                </Button>
              )}
            </div>
            {referralBonusLoading ? (
              <SkeletonCard className="w-full h-16" />
            ) : (
              <div className="flex items-center gap-4">
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  Current Reward:
                </span>
                <Badge
                  variant="default"
                  className="text-sm px-3 py-1 rounded-full"
                >
                  {referralBonusValues
                    ? `${referralBonusValues} Rupees`
                    : "No Referral bonus added"}
                </Badge>
              </div>
            )}
          </div>
        </div>
      </TabLayout>
      <EmailRewardModal
        mode="add"
        open={isAddRewardModalOpen}
        onOpenChange={setIsAddRewardModalOpen}
      />
      <EmailRewardModal
        mode="view"
        open={isUpdateRewardModalOpen}
        onOpenChange={setIsUpdateRewardModalOpen}
        emailReward={viewReward}
      />
      {/* withdraw */}
      <WithdrawlThresholdModal
        mode="add"
        open={isAddThreshldModalOpen}
        onOpenChange={setIsAddThreshldModalOpen}
      />
      <WithdrawlThresholdModal
        mode="view"
        open={isUpdateThreshldModalOpen}
        onOpenChange={setIsUpdateThreshldModalOpen}
        threshold={viewThreshld}
      />

      {/* signup bonus */}
      <SignupBonusModal
        mode="add"
        open={isAddSBonusModalOpen}
        onOpenChange={setIsAddSBonusModalOpen}
      />
      <SignupBonusModal
        mode="view"
        open={isUpdateSBonusModalOpen}
        onOpenChange={setIsUpdateSBonusModalOpen}
        signupBonus={viewSBonus}
      />

      {/* referral bonus */}
      <ReferralBonusModal
        mode="add"
        open={isAddRBonusModalOpen}
        onOpenChange={setIsAddSRModalOpen}
      />
      <ReferralBonusModal
        mode="view"
        open={isUpdateRBonusModalOpen}
        onOpenChange={setIsUpdateRBonusModalOpen}
        referralBonus={viewRBonus}
      />
    </>
  );
}
