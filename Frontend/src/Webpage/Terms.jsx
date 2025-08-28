import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

export default function Terms() {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 text-white px-6 py-12">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gray-800 hover:bg-gray-700 text-white transition"
      >
        <ArrowLeft size={20} />
        Back
      </button>
      <div className="max-w-4xl mx-auto space-y-12">
        {/* Header */}
        <section className="text-center space-y-4">
          <h1 className="text-4xl font-bold">Terms & Conditions</h1>
          <p className="text-gray-300">
            Please read these terms carefully before using PollWave. By accessing or using our platform, 
            you agree to be bound by these Terms & Conditions.
          </p>
        </section>

        {/* Terms Content */}
        <section className="space-y-8 text-gray-300">
          <div>
            <h2 className="text-2xl font-semibold">1. Use of Service</h2>
            <p>
              PollWave allows users to create and participate in polls and quizzes. You agree to use the 
              platform only for lawful purposes and in compliance with these terms.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-semibold">2. Accounts</h2>
            <p>
              Hosts are required to create an account to publish polls or quizzes. You are responsible for 
              maintaining the confidentiality of your login credentials and for all activities that occur under your account.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-semibold">3. Content Ownership</h2>
            <p>
              You retain ownership of the content you create (polls, quizzes, questions, etc.). However, 
              by publishing content on PollWave, you grant us a limited license to display and operate it within the platform.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-semibold">4. Participant Responsibilities</h2>
            <p>
              Participants can join polls or quizzes with creating an account. You agree not to misuse the 
              platform, attempt to manipulate results, or engage in disruptive behavior.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-semibold">5. Privacy</h2>
            <p>
              We respect your privacy. PollWave does not sell personal information to third parties. Please review 
              our Privacy Policy to learn how your data is collected and used.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-semibold">6. Limitation of Liability</h2>
            <p>
              PollWave is provided “as is.” We are not responsible for any loss, damage, or data errors arising 
              from the use of the platform. You use the service at your own risk.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-semibold">7. Termination</h2>
            <p>
              We reserve the right to suspend or terminate accounts that violate these terms or misuse the service. 
              You may stop using the platform at any time.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-semibold">8. Changes to Terms</h2>
            <p>
              PollWave may update these Terms & Conditions from time to time. Continued use of the service 
              means you accept the updated terms.
            </p>
          </div>
        </section>

        {/* Contact */}
        <section className="text-center space-y-2">
          <h2 className="text-2xl font-semibold">Contact Us</h2>
          <p className="text-gray-300">
            If you have any questions about these Terms & Conditions, please contact us at{" "}
            <a
              href="mailto:mysoulisinfinity1@gmail.com"
              className="text-blue-400 hover:underline"
            >
              mysoulisinfinity1@gmail.com
            </a>.
          </p>
        </section>
      </div>
    </div>
  );
}
