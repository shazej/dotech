import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import '../bloc/onboarding_bloc.dart';
import '../../jobs/presentation/pages/dashboard_page.dart';

class OnboardingPage extends StatefulWidget {
  const OnboardingPage({super.key});

  @override
  State<OnboardingPage> createState() => _OnboardingPageState();
}

class _OnboardingPageState extends State<OnboardingPage> {
  final _bioController = TextEditingController();
  final List<String> _selectedSkills = [];
  final List<String> _availableSkills = [
    'Cleaning',
    'Repairs',
    'Electrical',
    'Plumbing',
    'Painting',
  ];

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Complete Your Profile')),
      body: BlocConsumer<OnboardingBloc, OnboardingState>(
        listener: (context, state) {
          if (state is OnboardingCompleted) {
            ScaffoldMessenger.of(context).showSnackBar(
              const SnackBar(content: Text('Profile updated successfully!')),
            );
            Navigator.pushAndRemoveUntil(
              context,
              MaterialPageRoute(builder: (_) => const DashboardPage()),
              (route) => false,
            );
          } else if (state is OnboardingError) {
            ScaffoldMessenger.of(
              context,
            ).showSnackBar(SnackBar(content: Text(state.message)));
          }
        },
        builder: (context, state) {
          return SingleChildScrollView(
            padding: const EdgeInsets.all(20),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                const Text(
                  'Tell us about your services',
                  style: TextStyle(fontSize: 20, fontWeight: FontWeight.bold),
                ),
                const SizedBox(height: 24),
                TextField(
                  controller: _bioController,
                  maxLines: 3,
                  decoration: const InputDecoration(
                    labelText: 'Bio / Description',
                    hintText: 'Describe your professional experience...',
                    border: OutlineInputBorder(),
                  ),
                ),
                const SizedBox(height: 24),
                const Text(
                  'Select your skills',
                  style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold),
                ),
                const SizedBox(height: 12),
                Wrap(
                  spacing: 8,
                  children: _availableSkills.map((skill) {
                    final isSelected = _selectedSkills.contains(skill);
                    return FilterChip(
                      label: Text(skill),
                      selected: isSelected,
                      onSelected: (selected) {
                        setState(() {
                          if (selected) {
                            _selectedSkills.add(skill);
                          } else {
                            _selectedSkills.remove(skill);
                          }
                        });
                      },
                      selectedColor: Colors.indigo[100],
                      checkmarkColor: Colors.indigo,
                    );
                  }).toList(),
                ),
                const SizedBox(height: 40),
                ElevatedButton(
                  onPressed: state is OnboardingLoading
                      ? null
                      : () {
                          context.read<OnboardingBloc>().add(
                            UpdateProviderProfileEvent(
                              bio: _bioController.text,
                              skills: _selectedSkills,
                            ),
                          );
                        },
                  style: ElevatedButton.styleFrom(
                    minimumSize: const Size(double.infinity, 50),
                  ),
                  child: state is OnboardingLoading
                      ? const CircularProgressIndicator(color: Colors.white)
                      : const Text('Save & Continue'),
                ),
              ],
            ),
          );
        },
      ),
    );
  }
}
