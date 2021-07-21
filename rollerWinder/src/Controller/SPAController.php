<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Routing\Generator\UrlGeneratorInterface;
use Symfony\Component\Routing\RequestContext;

class SPAController extends AbstractController
{
    /**
     * @Route("/{reactRouting}/{reactParam}", name="home", defaults={"reactRouting": null, "reactParam":null})
     */
    public function index()
    {
        $link = "";
        /*$this->generateUrl(
            'reactRouting', [
                '{reactRouting}'=>null
            ],
            UrlGeneratorInterface::ABSOLUTE_URL
        );*/

        return $this->render('spa/index.html.twig', [
            'controller_name' => 'SPAController',
            'base_dir' => realpath($this->getParameter('kernel.project_dir')).DIRECTORY_SEPARATOR,
            "curr_route" => $link
            //'logo' => $manager->getUrl('bundles/myBundleName/img/rollerSliderLogo.png'),
        ]);
    }

    
}
